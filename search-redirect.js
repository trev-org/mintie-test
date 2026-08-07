(() => {
  const scriptVersion = 3;

  if (window.__mintieBrowseResultsInitialized) {
    if (window.__mintieBrowseResultsVersion !== scriptVersion) {
      window.location.reload();
    }
    return;
  }

  window.__mintieBrowseResultsInitialized = true;
  window.__mintieBrowseResultsVersion = scriptVersion;

  const browseResultSelector = "[data-browse-results-item]";
  const browseGroupSelector = "[data-browse-results-group]";
  const browseResultId = "mintie-browse-results";
  const browseResultVisibleAttribute = "data-browse-results-visible";
  let keyboardSelectionId;

  const isSearchInput = (element) =>
    element instanceof HTMLInputElement &&
    (element.id === "search-input" ||
      (element.getAttribute("role") === "combobox" &&
        element.closest('[role="dialog"][aria-label*="Search"]')));

  const getSearchUrl = (query) => {
    const searchUrl = new URL("/search", window.location.origin);
    searchUrl.searchParams.set("q", query);
    return searchUrl;
  };

  const style = document.createElement("style");
  style.textContent = `
    [data-component-part="search-list"][${browseResultVisibleAttribute}] {
      padding-top: 3.75rem !important;
    }
  `;
  document.head.appendChild(style);

  const createBrowseResult = () => {
    const result = document.createElement("a");
    result.id = browseResultId;
    result.tabIndex = -1;
    result.setAttribute("role", "option");
    result.setAttribute("data-browse-results-item", "");
    result.setAttribute("data-component-part", "search-item");
    result.setAttribute(
      "aria-label",
      "Browse: See the results in a standalone page",
    );
    result.className =
      "flex items-start gap-2 px-2 py-1.5 rounded-[calc(var(--rounded-search,1.25rem)-0.375rem)] cursor-pointer outline-hidden focus:outline-hidden! focus-visible:outline-hidden! select-none data-highlighted:bg-black/[0.03] dark:data-highlighted:bg-white/5 forced-colors:data-highlighted:outline forced-colors:data-highlighted:outline-1";
    Object.assign(result.style, {
      position: "fixed",
      zIndex: "2147483646",
      boxSizing: "border-box",
    });
    result.innerHTML = `
      <span data-component-part="search-item-icon" class="flex h-5 items-center shrink-0" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500 dark:text-gray-400 h-4 w-4 shrink-0">
          <path d="M4.75 4.75H13.25" />
          <path d="M4.75 9H13.25" />
          <path d="M4.75 13.25H10.25" />
        </svg>
      </span>
      <div class="flex min-w-0 flex-col gap-0.5">
        <div class="flex items-center gap-1.5 min-w-0">
          <span data-component-part="search-item-title" class="truncate text-sm font-medium leading-5 tracking-[-0.1px] text-gray-950 dark:text-white">Browse</span>
        </div>
        <span data-component-part="search-item-breadcrumbs" class="flex items-center gap-1 min-w-0 text-xs font-normal leading-4 text-gray-500 dark:text-gray-400">See the results in a standalone page</span>
      </div>
    `;

    result.addEventListener("pointerenter", () => {
      keyboardSelectionId = browseResultId;
      result.setAttribute("data-highlighted", "");
    });
    result.addEventListener("pointerleave", () => {
      if (keyboardSelectionId !== browseResultId) {
        result.removeAttribute("data-highlighted");
      }
    });

    return result;
  };

  const removeBrowseResult = () => {
    document.getElementById(browseResultId)?.remove();
    document
      .querySelectorAll(
        `[data-component-part="search-list"][${browseResultVisibleAttribute}]`,
      )
      .forEach((list) => {
        list.removeAttribute(browseResultVisibleAttribute);
        if (list.getAttribute("aria-owns") === browseResultId) {
          list.removeAttribute("aria-owns");
        }
      });

    // Remove elements inserted by earlier versions of this script.
    document
      .querySelectorAll(
        `[data-component-part="search-list"] ${browseResultSelector}`,
      )
      .forEach((result) => {
        result.remove();
      });
    document.querySelectorAll(browseGroupSelector).forEach((group) => {
      group.remove();
    });
  };

  const ensureBrowseResult = () => {
    const input = document.querySelector("#search-input");

    if (!isSearchInput(input)) {
      removeBrowseResult();
      return;
    }

    const query = input.value.trim();

    if (!query) {
      removeBrowseResult();
      return;
    }

    const listId = input.getAttribute("aria-controls");
    const dialog = input.closest('[role="dialog"]');
    const list =
      (listId && document.getElementById(listId)) ||
      dialog?.querySelector('[data-component-part="search-list"]');

    if (!list) {
      removeBrowseResult();
      return;
    }

    // Never add custom children to Mintlify's managed listbox. Doing so breaks
    // its internal option collection and keyboard/Assistant event handlers.
    list.querySelectorAll(browseResultSelector).forEach((result) => {
      result.remove();
    });
    list.querySelectorAll(browseGroupSelector).forEach((group) => {
      group.remove();
    });

    let browseResult = document.getElementById(browseResultId);

    if (!browseResult) {
      browseResult = createBrowseResult();
      document.body.appendChild(browseResult);
    }

    browseResult.href = getSearchUrl(query).href;
    list.setAttribute(browseResultVisibleAttribute, "");
    list.setAttribute("aria-owns", browseResultId);

    const listRect = list.getBoundingClientRect();
    Object.assign(browseResult.style, {
      left: `${listRect.left + 6}px`,
      top: `${listRect.top + 6}px`,
      width: `${Math.max(listRect.width - 12, 0)}px`,
    });

    if (keyboardSelectionId === browseResultId) {
      list
        .querySelectorAll('[role="option"][data-highlighted]')
        .forEach((option) => {
          option.removeAttribute("data-highlighted");
        });
      browseResult.setAttribute("data-highlighted", "");
      input.setAttribute("aria-activedescendant", browseResultId);
      list.setAttribute("aria-activedescendant", browseResultId);
    }
  };

  const getSearchElements = (input) => {
    const listId = input.getAttribute("aria-controls");
    const list =
      (listId && document.getElementById(listId)) ||
      input
        .closest('[role="dialog"]')
        ?.querySelector('[data-component-part="search-list"]');
    const browseResult = document.getElementById(browseResultId);

    if (!list || !browseResult) {
      return null;
    }

    return {
      list,
      options: [browseResult, ...list.querySelectorAll('[role="option"]')],
    };
  };

  const selectSearchOption = (input, list, options, option) => {
    keyboardSelectionId = option.id;

    options.forEach((item) => {
      item.toggleAttribute("data-highlighted", item === option);
    });
    input.setAttribute("aria-activedescendant", option.id);
    list.setAttribute("aria-activedescendant", option.id);

    if (option.id === browseResultId) {
      list.scrollTop = 0;
    } else {
      option.scrollIntoView({ block: "nearest" });
    }
  };

  let updateFrame;
  const scheduleBrowseResultUpdate = () => {
    if (updateFrame) {
      return;
    }

    updateFrame = window.requestAnimationFrame(() => {
      updateFrame = undefined;
      ensureBrowseResult();
    });
  };

  document.addEventListener(
    "input",
    (event) => {
      if (isSearchInput(event.target)) {
        keyboardSelectionId = event.target.value.trim()
          ? browseResultId
          : undefined;
        scheduleBrowseResultUpdate();
      }
    },
    true,
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        !isSearchInput(event.target)
      ) {
        return;
      }

      const query = event.target.value.trim();

      if (!query || !["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
        return;
      }

      ensureBrowseResult();
      const searchElements = getSearchElements(event.target);

      if (!searchElements) {
        return;
      }

      const { list, options } = searchElements;
      const activeId =
        keyboardSelectionId ||
        event.target.getAttribute("aria-activedescendant");
      const currentIndex = Math.max(
        options.findIndex((option) => option.id === activeId),
        0,
      );

      event.preventDefault();
      event.stopImmediatePropagation();

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex =
          (currentIndex + direction + options.length) % options.length;
        selectSearchOption(event.target, list, options, options[nextIndex]);
        return;
      }

      const selectedOption = options[currentIndex];

      if (selectedOption.id === browseResultId) {
        window.location.assign(getSearchUrl(query).href);
      } else {
        selectedOption.click();
      }
    },
    true,
  );

  document.addEventListener(
    "pointermove",
    (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const option = event.target.closest(
        `#${browseResultId}, [data-component-part="search-list"] [role="option"]`,
      );

      if (option?.id) {
        keyboardSelectionId = option.id;
      }
    },
    true,
  );

  window.addEventListener("resize", scheduleBrowseResultUpdate);
  window.addEventListener("scroll", scheduleBrowseResultUpdate, true);

  new MutationObserver(scheduleBrowseResultUpdate).observe(
    document.documentElement,
    {
      childList: true,
      subtree: true,
    },
  );
})();
