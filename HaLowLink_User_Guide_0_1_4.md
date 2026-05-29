---
title: "HaLowLink User Guide"
---

<Note>
  Refer to the [online version](https://morsemicro.com) for up-to-date content.
</Note>

## What is a HaLowLink?

Your HaLowLink allows you to use Morse Micro's HaLow Wi-Fi to:

- Easily set up a **Router with a HaLow Access Point** to create a new network which supports HaLow
- Let other HaLow-enabled devices connect to your existing network through a **HaLow Access Point**
- Add a **HaLow Extender** so that existing non-HaLow devices (i.e. 2.4 GHz Wi-Fi and Ethernet computers) can benefit from HaLow's range

It's flexible and powerful enough that it can perform all these roles. For more information on how these roles can be useful, see the [Use Cases](#use-cases) section below.

### HaLowLink Models

This guide applies to both the **HaLowLink 1** and the **HaLowLink 2** models. Both devices share the same core functionality and run the same HaLowLink variant of **Morse Micro OpenWrt** software (open-source versions are available at [github.com/MorseMicro/openwrt](https://github.com/MorseMicro/openwrt)).

The only critical differences between the two models are in the **hardware**. The primary upgrade is a transition from the Morse Micro **MM6108** HaLow chip in the HaLowLink 1 to the next generation **MM8108** chip in the HaLowLink 2.

The purpose of this guide is to provide a unified set of user instructions which apply equally to both models. If at any point in the future this guide is updated to include model-specific instructions, they will be explicitly identified. In all other cases, the term **HaLowLink** (without a model number suffix) will be used to refer to all models equally.

---

## Important Security Notice

There have been some significant updates to the Morse Micro OpenWrt software in order to remain compliant with international cybersecurity requirements.

### HTTPS-Only Access

The HaLowLink web interface, from Morse Micro OpenWrt 2.11.x onwards, is accessible **only via HTTPS**. Any attempt to connect using HTTP will automatically redirect to `https://192.168.12.1`.

When you first connect, your browser may display warnings about the page being insecure. This is expected, because the HaLowLink uses an encrypted HTTPS session without a signed certificate. You must proceed through these warnings in order to continue accessing the device. This is safer than HTTP as all traffic will be encrypted.

### SSH Disabled by Default

To enable SSH, navigate to the **SSH Access** tab on the Administration Page in [Advanced Config](#advanced-config).

### Software Updates

To maintain compliance with evolving cybersecurity requirements, updates for this device may be released more frequently and it is strongly recommended to regularly check for new updates via the [Software Updates](#software-updates) page.

### Open Network Ports

The following table documents the open network ports and their associated services on the device.

| Port | Protocol | Service (Daemon) | Purpose |
| --- | --- | --- | --- |
| 53 | UDP/TCP | DNS (dnsmasq) | Provides local DNS resolution required for basic network operation. Restricted to trusted network interfaces only. |
| 80 | TCP | HTTP (uhttpd) | Redirects HTTP requests to the encrypted HTTPS management interface. No administrative functions or sensitive data are exposed over HTTP by default. |
| 443 | TCP | HTTPS (uhttpd) | Provides an encrypted web-based administrative interface (HTTPS/TLS). Access restricted to trusted LAN interfaces by default and requires user authentication except for unconfigured extenders. |
| 67 | UDP | DHCP Server (dnsmasq) | Provides DHCP services to assign IP addressing to devices on trusted local network interfaces. |
| 5353 | UDP | mDNS (umdns) | Provides link-local multicast DNS functionality for name resolution and service discovery on trusted local network interfaces only. |
| 7681 | TCP | Terminal interface (ttyd) | Provides a web-based terminal interface for local device administration on trusted local network interfaces. Note: ttyd does not provide a secure shell (SSH) session and all terminal traffic is transmitted in clear text. The port is closed by default and is only opened when ttyd is explicitly enabled through the GUI. |

---

## Preset Configurations

Below are high-level descriptions of common configuration "presets", which are combinations of HaLow Mode and Network Mode, and can be configured via the [Wizard](#wizard) page.

### Router With a Wi-Fi HaLow Access Point

This is the **default mode of operation** for the HaLowLink. It has an IP address of `192.168.12.1` and hands out addresses to devices connected to the LAN side via Ethernet, 2.4 GHz Wi-Fi, or Wi-Fi HaLow in this range. The WAN Ethernet port is the default uplink connection and will obtain an address as a DHCP client. In this mode the HaLowLink is most similar to a typical home router/gateway, and it is not possible to access the web interface via the uplink connection.

### Wi-Fi HaLow Access Point (AP)

Similar to access points (APs) available on the market, this allows you to add a HaLow Access Point to your existing network. You still use your WAN Ethernet port (which is more appropriately considered the "Uplink Ethernet Port" in this scenario) for the uplink connection, but any attached HaLow devices will use DHCP to obtain addresses on your existing network (i.e. home router) subnet. This means no traffic forwarding/NAT is required. **This is the most appropriate mode for most use cases**, as it makes it straightforward for anyone on your network to interact with HaLow-connected devices.

It will also be possible to access the web interface via your existing local network by determining which IP is assigned to the HaLowLink. However, the `192.168.12.1/24` network will remain accessible on the LAN Ethernet port. This functions as a separate management interface independent of the existing network, making it simpler to reconfigure.

### Wi-Fi HaLow Extender

Extenders generally receive a Wi-Fi signal and rebroadcast it. In Wi-Fi jargon, these devices are clients/stations rather than APs in regards to the HaLow network.

The goal of this mode of operation is to help get another device connected to a HaLow network. That device might be connected to the HaLowLink via Ethernet or 2.4 GHz Wi-Fi, and then the HaLowLink passes that traffic via HaLow, effectively extending the range of the non-HaLow device.

---

## Getting Started

### Initial Connection

Connect the provided antenna to the antenna connector first. Then connect your device to the HaLowLink.

#### Using Ethernet

1. Connect your HaLowLink to power via the USB-C port using the provided power supply.
2. Connect your computer to the **LAN port** of the HaLowLink using the provided Ethernet cable.

#### Using Wi-Fi

1. Connect your HaLowLink to power via the USB-C port using the provided power supply.
2. Once the device is fully booted, connect your computer or phone to the Wi-Fi network of the HaLowLink by scanning the QR code or using the Wi-Fi SSID/password on the label.

#### Using USB-C

Connect your HaLowLink to your computer directly using the USB-C cable provided. Ensure that the USB port on your computer can provide sufficient power.

#### Connecting to an Existing Network Using Ethernet

Optionally, if you want your downstream devices to have access to an existing network via your HaLowLink, connect an Ethernet cable from the **WAN port** of your HaLowLink to your home router (or any network with a DHCP server).

### Login Page

Once you're connected to the HaLowLink, use a web browser to connect to `https://192.168.12.1`. To login, use the Device Username and Password on the label; we recommend letting your browser save the password.

You should now be able to see the **Home** page, where initially, you will see **0 Connected Devices** on your HaLow network.

### Getting the Latest Software

In order to get the latest features, fixes and security upgrades, we recommend checking for any updates as soon as you log in for the first time (see the [Software Updates](#software-updates) section).

### Home Page

The Home page will automatically update if changes occur in your network. To view more information, click on the large numbers on the card or on the icon in the top right. Make sure the **Uplink** card does not show as disconnected if you want your HaLow devices to have access to an existing network or the internet.

### Wizard

When you first power on your HaLowLink it will be a Router with a HaLow Access Point. If you'd like to change this mode, navigate to the **Wizard** page using the sidebar menu.

<Note>
  Using the wizard assumes default config as a starting point, so it will overwrite customizations made outside of the wizard.
</Note>

#### Wi-Fi HaLow Modes

The **Wi-Fi HaLow Mode** options in the wizard control how the Wi-Fi HaLow network operates. By default, the device runs as an **Access Point** which is sufficient for most use cases thanks to Wi-Fi HaLow's long range. If your particular scenario requires even greater coverage or more redundancy, you can also use the wizard to configure a mesh — either EasyMesh or 802.11s Mesh — with multiple HaLowLink devices.

#### Network Modes

The **Network Mode** settings define how the HaLowLink will connect to other networks (uplinks) such as your home's internet, and how it will provide access to the downstream HaLow devices.

**Wi-Fi HaLow devices will get an IP on your existing router's network (recommended)**

In this mode the HaLowLink acts as an Access Point with an Ethernet uplink via the WAN Ethernet Port. HaLow devices will receive IP addresses from your existing network's DHCP server, allowing seamless integration with other devices on that LAN. The firewall will be effectively inactive and your existing router handles security and routing.

If possible, we recommend selecting this option. This will effectively change your device from a Router with a HaLow Access Point to a HaLow Access Point (AP).

This option will only work if you have connected your WAN port to your existing router and your HaLowLink has obtained an IP address. To confirm this, go to the **Home** page and make sure you have been assigned an IP on the **Uplink** card.

_Use this option when you have a wired Ethernet connection to your HaLowLink WAN port and want HaLow devices to join your main network directly like normal devices._

---

**Wi-Fi HaLow devices will get an IP on this device's local network (default)**

In this mode, the HaLowLink creates its own local subnet and DHCP service for HaLow devices. If connected to the **WAN Ethernet** port, devices may still reach the internet, but IP addresses come from the HaLowLink itself rather than the upstream router. In this mode, the firewall is active and will block incoming connections on the `wan` interface whilst forwarding traffic originating from the `lan` out through that same `wan` interface.

_Use this for new or standalone HaLow networks rather than extending an existing network, for isolated test setups, or when you want control over the IP range._

---

**Wi-Fi HaLow devices will get an IP on this device's local network and use 2.4 GHz Wi-Fi for an uplink (not an Ethernet cable)**

In this mode, the HaLowLink acts as a router with a 2.4 GHz Wi-Fi uplink instead of an Ethernet connection to the WAN port. HaLow devices receive IP addresses from your existing Wi-Fi router. In this mode, the firewall is active.

Once you have clicked **Save & Apply** in the wizard, you will still need to provide the Wi-Fi credentials:

1. Navigate to the **Home** page and click the **Disconnected** cross on the **Uplink** card.
2. Search for your Wi-Fi network and enter your password, then save the credentials.
3. Wait for **Connected** to change to **yes**. You should now see a tick on the Uplink card.

_Use this when Ethernet cabling to the external network is unavailable, but you still want HaLow devices to join your existing Wi-Fi LAN._

---

## HaLow Extender

<Note>
  You don't need to use the web interface to switch to Extender mode — this can be done directly with the Mode button.
</Note>

By default, your HaLowLink comes configured as a HaLow Access Point. However, it can also be used as a HaLow Extender when you have more than one HaLowLink device. This will let existing Wi-Fi and Ethernet devices make use of HaLow's long range.

To switch your HaLowLink into Extender mode:

1. Power on your HaLowLink and wait until the Status LED is solid (green or aqua).
2. Hold down the **Mode button**. The Status LED will first start flashing slowly green, and then start flashing quickly aqua. **Release the button when it's flashing aqua.**
3. Wait until the Status LED is solid aqua to indicate it's loaded and running in Extender mode.

### Pairing

Pairing is designed to make connecting your HaLowLink Extender to a HaLowLink Access Point as simple as possible. When using this method, the Access Point automatically pushes the correct configurations to the Extender so you don't need to manually repeat settings on each Extender you add to the network.

For example, if you've used the Access Point Wizard to configure the AP as an EasyMesh Controller, every extender you pair will automatically be set up as an EasyMesh Agent.

In Extender mode your device will not be accessible at `https://192.168.12.1`. Instead, pair it to an existing HaLowLink by:

1. **Press and immediately release** the mode button on your HaLowLink **Access Point** (green Status LED). The Wi-Fi HaLow LED will begin slowly flashing to indicate it's ready to pair.
2. **Press and immediately release** the mode button on your HaLowLink **Extender** (aqua Status LED). The Wi-Fi HaLow LED will begin slowly flashing to indicate it's searching for an Access Point to pair with.
3. Wait until the Wi-Fi HaLow LED on your HaLowLink Extender is **solid purple**. Your Extender has now stored the Wi-Fi credentials, and is ready to use!

If pairing fails, the HaLow LEDs will begin to flash quickly for 120 seconds to indicate the retry delay — a security feature to prevent brute force attempts. After the HaLow LEDs stop flashing on both devices, you can attempt the pairing again from Step 1.

### Manual Extender Configuration (Alternative)

We recommend using standard Pairing whenever possible. However, manual configuration of a HaLow network SSID/password may be required in certain cases and we have provided a special portal for this purpose.

1. Factory reset the device and switch it into Extender Mode.
2. Connect to the device using one of the methods described in [Initial Connection](#initial-connection) and navigate to `https://192.168.12.1`. You should see the special **HaLow Extender Configuration** portal.
3. Fill out the form with the details of the HaLow network you intend to connect to.
4. (Optional) Modify the name of the 2.4 GHz Access Point hosted by the Extender.
5. Click **Save**. The device has begun trying to connect to the HaLow network you specified. Note that this portal will no longer be accessible once the device connects.

If the credentials are correct and the network is within range, your Extender should successfully connect and the **HaLow LED** will turn on. If the HaLow LED does not light up as expected, consider performing a factory reset and trying again.

### Using Your Extender's Connection

You can connect devices to your Extender via an Ethernet cable or via 2.4 GHz Wi-Fi, and this will let them use the Extender's HaLow connection. For the Wi-Fi credentials, refer to the label **on your Extender**. These will not be the same as the credentials on your Access Point.

---

## Mesh (Advanced)

<Warning>
  Mesh is not currently supported in the EU or UK because regulatory rules require dynamic channel changing during operation. This is currently implemented on a per-device basis, but mesh devices in the same mesh must all have the same channel.
</Warning>

Mesh technology allows the creation of multi-hop networks which can extend coverage and improve redundancy.

To set up a mesh, configure your Access Point mode (green Status LED) HaLowLink as an EasyMesh Controller or a 802.11s Mesh peer by applying the relevant HaLow Mode option in the Wizard. When you pair additional HaLowLinks it will automatically push the corresponding 802.11s Mesh Point or EasyMesh Agent configurations to the Extender being paired with.

<Note>
  If you have configured your device in one of the mesh modes, avoid making significant networking changes in the UI as it is very easy to misconfigure. For EasyMesh specifically, some settings are managed automatically and are not made visible in the web interface.
</Note>

### Should I Use a Mesh?

Mesh networks allow the use of multiple HaLowLink devices to extend network coverage but are **complex and often misunderstood** and can even degrade network performance if deployed improperly. For most use cases, a single HaLow Access Point should provide more than enough coverage.

**Limitations of mesh networks:**

- Each additional hop reduces the throughput by half
- The number of hops are limited
- There is a large amount of beaconing and control traffic overhead

**You likely do not need a mesh if:**

- Your existing AP \+ STA HaLow network already provides sufficient coverage
- You only have two (2) HaLowLink devices

**You can use a mesh when:**

- You have dead zones or unreachable areas
- You need a reliable and redundant network with multiple paths more than you need speed

### HaLowLink Mesh Comparison

| Feature | EasyMesh | 802.11s Mesh |
| --- | --- | --- |
| Best For | Smaller fixed networks requiring greater coverage for end devices | Larger or complex topologies requiring advanced routing and redundancy |
| Example Use Case | Expanding coverage within a single building or site | Multi-building, industrial, or outdoor deployments needing fault tolerance |
| Controller & Topology | Controller-managed tree | Distributed peer-to-peer |
| Redundancy | Partial support with STA steering | Designed for multiple paths |
| Node Mobility | Designed for fixed devices only | Supported |
| Standards | Wi-Fi Alliance EasyMesh Standard | IEEE 802.11s |
| Co-located HaLow Access Points | HaLow STAs can connect to any AP node in network | 802.11s Mesh Gates can be manually configured with an AP |
| Maximum Peer Nodes | 4 | 10 |
| Maximum Hops | 2 | 4 |
| Performance | Lower latency single backhaul per tree | Slower due to higher overhead on multiple peer links |

### EasyMesh

EasyMesh is a Wi-Fi Alliance Multi-AP solution for meshing together Access Points in a tree structure to extend coverage (but with reduced bandwidth available to clients). Configured as a HaLow Mode from the Wizard page, **EasyMesh Controllers** (green Status LED) discover, configure and monitor **EasyMesh Agents** (aqua Status LEDs), ensuring consistent SSIDs and channel information across the mesh.

Agents connect upstream towards the Controller as normal clients while simultaneously serving downstream clients as normal Access Points themselves, allowing any HaLow device with the correct credentials to connect. Agents can also onboard client devices onto the mesh via **Ethernet (any method)** and the built-in **2.4 GHz AP**.

You can use the **EasyMesh visualizer** by clicking on the **EasyMesh Controller** card on the Home page of the Access Point Mode device (green status LED), which will display the connected nodes.

### 802.11s Mesh (beta)

<Note>
  802.11s Mesh is a beta feature for experimental use, but not intended for production use yet.
</Note>

802.11s Mesh is an IEEE Wi-Fi mesh which forms a truly distributed peer-to-peer multi-hop Mesh Basic Service Set (MBSS). Configured as a HaLow Mode via the Wizard page, 802.11s Mesh networks aim to increase coverage, redundancy and range by establishing self-healing links between neighboring 802.11s Mesh nodes in the topology. Only mesh capable devices can join or make use of the functionality provided by the MBSS.

802.11s Mesh HaLowLink networks can be accessed via the **Ethernet (any port)** or the **2.4 GHz Wi-Fi AP** on the devices. Units with a green Status LED also run a co-located HaLow Access Point which can allow the mesh to be bridged to external HaLow networks.

You can use the **802.11s Mesh visualizer** by clicking on the **802.11s Mesh Topology** card on the Home page of any 802.11s mesh devices, which will display the topology as seen by that node.

### Pairing Extenders to a Mesh

If you pair a HaLowLink Extender to a Mesh-enabled 'green' HaLowLink it will automatically become part of the mesh (either a Mesh Point or an EasyMesh Agent).

If you instead want to configure an Extender as a normal station/client device, you should do so via the [Manual Extender Configuration](#manual-extender-configuration-alternative) method. A manually configured device will not automatically become part of the mesh.

In summary:

- **Pair Extender (aqua) via push button** → becomes part of mesh
- **Enter manual credentials on Extender via web interface** → normal client Extender mode

#### EasyMesh Pairing

Once a device is configured as an Agent, the role of the mode button is now to onboard new devices to the mesh. The SSID of the original 'green' HaLowLink is propagated to all devices in the Mesh both for the 2.4 GHz Wi-Fi and the HaLow Wi-Fi — note that the QR code on your Extenders will no longer work to connect to the device individually, but you will have a consistent SSID.

#### 11s Mesh Pairing

Unlike EasyMesh, any Extender will **not** have an additional HaLow Access Point, as the HaLow interface will be exclusively used for the Mesh. The 2.4 GHz Access Point on the Extender is unmodified, so all Extenders will have a distinct SSID and key (by default the one encoded on the QR code). In this mode, Extenders will not support any further pairing actions, and must be reset to be re-paired.

If you want to connect HaLow client devices that do not support 11s Mesh to 11s Mesh Extenders, you can manually add a HaLow Access Point via the Quick Config interface. This will also re-enable the pairing function of the mode button.

---

## Restoring Factory Settings

A factory reset is useful if you:

- Don't want to use your HaLowLink as an Extender anymore
- No longer have access to your device via the network after making configuration changes
- Want to start fresh by configuring your HaLowLink for a new purpose

A factory reset always returns to **Access Point mode** (green Status LED), which is the default. To perform a factory reset:

1. Power on your HaLowLink and wait until the Status LED is either solid green or solid aqua.
2. Hold down the **Mode button** until the Status LED begins flashing slowly green, then release it.
3. Wait until the device resets and the status LED changes to solid green, indicating that it is running in Access Point mode.
4. You can now access your device at `https://192.168.12.1` again, as described in [Initial Connection](#initial-connection).

<Warning>
  In Step 2, if you continue holding down the button until the status LED is flashing quickly aqua, the device will reset into **Extender mode** instead.
</Warning>

---

## Use Cases

These are some common use cases for the HaLowLink with some pointers on how to set them up. If you have previously configured your HaLowLink in some way, you may want to [Restore Factory Settings](#restoring-factory-settings) before following these instructions.

### Adding a HaLow Access Point to Your Existing Network via Ethernet

The primary use case for a HaLowLink is to add HaLow support to your existing network, allowing any HaLow-enabled client to work in the same way as any other Wi-Fi client.

1. Make sure your HaLowLink is in Access Point mode (green Status LED).
2. Connect the **WAN port** of your HaLowLink to your network; in the home, this usually means placing it next to your router and connecting the WAN port to a LAN port.
3. HaLow devices can then connect via the SSID/password printed on the sticker.

Although it will work as-is for many use cases, for the best experience we recommend using the Wizard to set **Wi-Fi HaLow devices will get an IP on your existing router's network**, which will change it from a Router with HaLow Access Point to a HaLow Access Point.

### Adding a HaLow Access Point to a Network via 2.4 GHz Wi-Fi

If it's not possible to connect your HaLowLink via Ethernet, you can connect it via 2.4 GHz Wi-Fi. You should only do this if Ethernet is not possible, as it will require your HaLowLink to act as a router, forwarding traffic from `192.168.12.x` over the Wi-Fi link.

1. Make sure your HaLowLink is in Access Point mode (green Status LED). See [Restoring Factory Settings](#restoring-factory-settings) if it's not.
2. Go to the Wizard at `https://192.168.12.1` and set the Network Mode to **Wi-Fi HaLow devices will get an IP on this device's local network and use 2.4 GHz Wi-Fi for an uplink**, then go to the Home page to configure your credentials.
3. HaLow devices can then connect via the SSID/password printed on the sticker.

This may be particularly useful on networks you don't have administrator access to. In fact, the HaLowLink can act as a travel router in this situation, providing your own private network with not just a HaLow Access Point but also a 2.4 GHz Wi-Fi access point and Ethernet connectivity.

### Using HaLow to Extend an Existing Network — Virtual Wire

This requires **two (2) HaLowLink devices**, and will make a HaLow link a transparent part of your network, functioning just like an Ethernet cable.

First, add a HaLow Access Point to your network (see the sections above). Once your network supports HaLow, follow the instructions in the [Extender section](#halow-extender). In summary:

1. Make sure your HaLowLink is in Extender mode (aqua Status LED).
2. Pair your Extender with your Access Point by pressing and releasing the mode button on your Access Point, then pressing and releasing the mode button on the Extender. The HaLow LED will slowly flash, usually for around 10 seconds, before turning a solid purple on the Extender to show it's connected.
3. Now any device connected to the Extender — via USB, 2.4 GHz Wi-Fi, or Ethernet — will make use of the HaLow link to connect to your network.

### Connect Your Computer to a HaLow Network via USB-C

Set up an Extender as described in the [Virtual Wire](#using-halow-to-extend-an-existing-network--virtual-wire) section, then:

1. Connect your computer via the provided USB-C cable to your Extender (aqua status LED).
2. A new Ethernet adapter should appear on your computer. Make sure it's configured as a DHCP Client.
3. You can now send traffic via the HaLow link.

<Note>
  Because it's an Ethernet connection, by default your computer will likely use it in preference to any existing wireless connection. See the [Troubleshooting](#troubleshooting) section for more information.
</Note>

### Connect an Ethernet Device to a HaLow Network

Set up an Extender as described above, then:

1. Connect your device via an Ethernet cable to your Extender (aqua status LED).
2. Your device should now acquire an address via DHCP.

### Connect a Non-HaLow Wi-Fi Device to a HaLow Network

This could be a computer, tablet, phone, or any IoT device. Set up an Extender as described above, then:

1. Set the SSID/password of the **Extender** (NOT the Access Point) via scanning the QR Code on the bottom of the Extender or copying the credentials from the same sticker.
2. Your device should now acquire an address via DHCP.

### Experimenting with HaLow

If you're currently just experimenting with HaLow's range and penetration, the easiest way to test with a HaLowLink is to have two devices and two laptops, where the laptops provide power to the HaLowLink. This allows you to easily move around.

1. Connect one laptop via USB-C to your **Router with HaLowLink Access Point** (i.e. the factory default configuration), and go to `https://192.168.12.1`.
2. Connect another laptop to an Extender via USB-C, then set up the Extender as described in the [Virtual Wire](#using-halow-to-extend-an-existing-network--virtual-wire) section.
3. You should see the Extender appear on the Home page of the Access Point in the **Connected Devices**, and the **Local Network** card should show the IPs of both the Extender and your other laptop.
4. You can now test out the connection from one laptop to the other via HaLow. For more information, see [Exploring HaLow Connectivity](#exploring-halow-connectivity).

<Note>
  Because the USB link is via Ethernet, by default your computer will likely use this in preference to any existing wireless connection. See the [Troubleshooting](#troubleshooting) section for more information. If you're familiar with OpenWrt, you can stop this happening by configuring the DHCP server to return nothing for Option 3 (gateway).
</Note>

---

## Quick Config

For most users the Wizard page will be sufficient to configure a HaLow Access Point (green mode), and an Extender (aqua mode) can be configured via the Mode button as described above. However, if you want to make simple minor changes to your configuration — such as changing your Wi-Fi password or encryption method, or setting a Static IP — you can do so via the **Quick Config** page. To help you understand the changes you're making, these will be reflected in the diagram at the top of the page as you make them.

<Warning>
  It is easy to change the configuration of your device here in a way that causes you to lose access to it, particularly if you're changing network interfaces. If this happens, see [Restoring Factory Settings](#restoring-factory-settings).
</Warning>

### Network Interfaces

This section lists the logical interfaces available on your router, each of which can be configured with either a Static IP (and potentially a DHCP Server) or as a DHCP Client. If you have multiple Ethernet ports or Wireless interfaces on the same network, a bridge will automatically be created. Note that to attach new Wireless interfaces to the network, you will need to use the Wireless section.

### Wireless

This will allow you to configure the Wi-Fi interfaces on your HaLowLink. Note that it is possible to create multiple interfaces for a particular radio.

### Advanced Usage

The Quick Config page is designed to correspond to the underlying text based configuration and connect with the pages accessible via Advanced Config. If you have Advanced Config enabled, you can use the **cog icons** on the Quick Config to access these pages, which will allow you more flexibility in your setup. It will also allow you to simply **Save** rather than **Save & Apply**, which will let you view and apply or revert the proposed changes by clicking on the **Unsaved Changes** indicator at the top right.

For more about the underlying configuration format (known as UCI), see [Configuring With the Command Line](#configuring-with-the-command-line).

---

## Advanced Config

The software running on your HaLowLink is based on **OpenWrt**, a Linux operating system targeting network-connected devices. While the Wizard page provides basic preset configuration options, the **Advanced Config** section enables more advanced customizations. The Quick Config page allows convenient access to frequently modified settings, whereas the other sub-menus within Advanced Config provide more granular and specific access to advanced functionalities.

This section will allow you to:

- View detailed information about your device
- Change low-level configuration
- Install additional software if you have an internet connection (via the **Software** page under the **System** sub-menu)
- Access the Linux terminal from the **Terminal** page

You can also directly connect to your device via **SSH** (must be [enabled first](#ssh-disabled-by-default)) using the same username and password you used to login. This is printed on the label.

For more information about OpenWrt, see [openwrt.org/start](https://openwrt.org/start).

---

## Exploring HaLow Connectivity

Your HaLowLink comes packed with useful utilities and pages to make the most of your HaLow connection. The following pages are only accessible once Advanced Config has been enabled.

### Status

#### Channel Analysis

This will allow you to see the channels and signal strength of any other nearby HaLow networks. If there are many local HaLow networks, you may want to change the channel via the Quick Config page to avoid interference.

#### Realtime Graphs

This will show you a continuously updating graphical view of the link quality as well as other critical system metrics while you have the page open.

### Network

#### Diagnostics

This allows simple access to command line tools to evaluate your network, including `iperf3` (to test bandwidth), `ping` and `traceroute` to explore connectivity, and `arp-scan` to discover all devices on the network. It also will show you the command it's executing, as you may also want to do this via the command line.

### Statistics

#### Graphs

Your HaLowLink runs `collectd` to continuously monitor the behavior of the device. Some of the information here is similar to Realtime Graphs, but it's updated at a lower frequency and stored while the device is running rather than just while you're on the page. It's also possible to configure other devices to point to this (e.g. Extenders) to aggregate all your statistics in a single place.

### Services

#### Terminal

For easy access to the Linux console, you can start a terminal on the device by going to **Terminal**. Note that you will have to re-enter your device password (refer to the sticker on the bottom of your HaLowLink).

<Note>
  The in-browser terminal does not work over HTTPS. To use it, follow the browser's warning link to disable this security feature.
</Note>

From the command prompt, you will have access to the standard Linux utilities included in OpenWrt, as well as some other useful programs:

| Utility | Purpose |
| --- | --- |
| `morse_cli` | Low level access to information from and settings on the Morse Micro HaLow chip. |
| `wavemon` | Terminal graphical program to monitor Wi-Fi signal strength and performance. |
| `nano` | Text editor, including syntax highlighting of UCI files. You may also use `vi`. |
| `tmux` | Terminal multiplexer, allowing persistent sessions and windows. |

#### Range Test

The Range Test application is designed as a simple way to analyse HaLow network performance by automating `iperf3` tests and collecting real-time statistics. It is a useful tool for quickly assessing signal strength, data throughput, and connection quality across different environments.

<Note>
  Ensure that all devices under test are running the same version of Morse Micro OpenWrt.
</Note>

To use the range testing tool:

1. Connect the devices being tested on the same HaLow network of any type outlined in this guide (Default AP/STA configurations are the most reliable).
2. Set up the devices in the desired locations and select a local device to connect a laptop to.
3. Select the IPv4 address from the **Remote Device** dropdown. If it does not appear on first load, click the 🔍 icon to run another discovery. If this fails to find another device, you may enter a known IPv4 address into the **custom** field.
4. Fill in the **Password** field using the remote device password (not the Wi-Fi password).
5. (Optional) Provide user notes about the test in the **Description** field.
6. (Optional) If you want to log the coordinates of the local and remote devices and have the range calculated automatically, enter the decimal degree values into the coordinate fields respectively. Right-click a location in Google Maps to copy its coordinates to your clipboard in the correct format.
7. Click **Start Test** and a progress bar will appear showing the status of the current test. This can be cancelled at any time by clicking the **Stop** button.

After the test completes, a row in the **Results Summary** subsection should appear. This result can be deleted by clicking the trash icon, or a JSON file containing all the raw data can be downloaded via the **Download** button. The **Download Results Summary (CSV)** button yields a CSV file of all the data represented in the results summary.

<Note>
  Test results are volatile to avoid overwhelming limited memory resources and will be deleted if power is removed or the device is rebooted.
</Note>

<Warning>
  If the throughput numbers are returning ~40 Mbps for UDP and 900\+ Mbps for TCP then the test is likely defaulting to run over an Ethernet connection. This should be avoided.
</Warning>

---

## Configuring With the Command Line

The HaLowLink is an open device running Linux, and it is straightforward to gain direct access via either SSH (must be enabled first) or the Terminal page (accessible after enabling Advanced Config).

Because it's based on OpenWrt, the primary mechanism of configuration is via **UCI** ([openwrt.org/docs/guide-user/base-system/uci](https://openwrt.org/docs/guide-user/base-system/uci)), which is fundamentally just a collection of files in `/etc/config` in a particular format.

### Making Changes

This happens in 2 steps:

1. Set new values in UCI
2. Run `reload_config` to reload services

You can make changes to UCI via the `uci` command or by editing the files in `/etc/config`. For example:

```bash
nano /etc/config/wireless
```

Or:

```bash
uci show wireless
uci set wireless.default_radio0.mode=sta
uci commit
```

Doing a `uci commit` will cause the change to appear in `/etc/config/wireless`. Once you've made changes, to make them take effect use `reload_config`. Other files/services that are likely to be useful for network config are `dhcp`, `network`, and `firewall`.

Aside from the UCI documentation mentioned above, the most useful resource is clicking **Save** rather than **Save & Apply** in the UI (only available when Advanced Config is enabled). This allows you to view a sequence of `uci set` commands corresponding to the change you just made via the **Unsaved Changes** dialog at the top right.

### File/Service Structure

- **`wireless`** — Contains the radio devices (`wifi-device`) and the interfaces connected to that (e.g. `wlan0`, `wlan1` — caused by a `wifi-iface`). Any `wifi-iface` has a `network`, which refers to an interface in the network UCI file. This corresponds to the Wireless section on the Quick Config page.
- **`network`** — Contains a mix of switches/bridges and logical interfaces; an interface in a network may point to a bridge, in which case multiple Ethernet ports or `wifi-iface`s might be attached to it. Note that the wireless interfaces are not directly mentioned here, only in the wireless file. This corresponds to the Network Interfaces section on the Quick Config page.
- **`firewall`** — Controls `nftables` — i.e. forwarding/masquerading as well as simple accept/reject. Firewalls have another level of indirection — zones — such that you can potentially put multiple network interfaces in one zone.
- **`dhcp`** — Controls `dnsmasq` — i.e. **DHCP and DNS**. The usual setup is that there's always `dnsmasq` running, but if you don't want DHCP active on particular interfaces you set them to **ignore**.

### Debugging

If you've made a change and it's not working the way you expect, this command is useful for following the logs as they are generated:

```bash
logread -l 100 -f
```

This is the primary mechanism OpenWrt uses for reporting that something went wrong.

Note that if you've manually edited the files rather than using `uci set`, it's possible you've made them invalid. Use `uci show` to confirm that the UCI library can still parse them.

### Applying Configurations

We recommend using `reload_config` to apply configurations. What this does is:

- Check to see if any of the config files have changed
- Trigger a reload on any services affected by these changes (i.e. not a restart)

There are other ways to do this:

- Explicitly reloading a single service: `service <service> reload`
- Explicitly restarting a single service: `service <service> restart`
- Bringing down only the wifi interfaces and back up without restarting the network: `wifi down && wifi up`

<Note>
  Manually triggering a reload will pick up uncommitted changes.
</Note>

---

## Software Updates

To update your software, use your browser to access the web interface (usually at `https://192.168.12.1`) as described in [Initial Connection](#initial-connection). Then select **Advanced Config**, and you should see the **Upgrade** page.

- The **Check for automatic upgrade** button will attempt to obtain the new version of firmware from the Morse Micro servers. This requires an available internet connection — either through the browser you are using to access the HaLowLink GUI, or through the HaLowLink device itself via an uplink.
- The **Manually upload firmware file** button will let you upload any compatible firmware.

<Note>
  If your HaLowLink device has internet access, update notifications will appear automatically on the Home page within the Version card.
</Note>

---

## Device Features

### LED Indicators

#### Status LED

| Color & Behavior | Meaning |
| --- | --- |
| Yellow flashing | Factory reset in progress. |
| Yellow solid | Bootloader running. |
| Green flashing | OpenWrt booting into **Access Point** mode. |
| Green solid | OpenWrt is loaded and running in **Access Point** mode. |
| Aqua flashing | OpenWrt is booting into **Extender** mode. |
| Aqua solid | OpenWrt is loaded and running in **Extender** mode. |
| Blue flashing | OpenWrt is executing a software update (do not disconnect power when this is happening). |

#### Wi-Fi HaLow LED

| Color & Behavior | Meaning |
| --- | --- |
| None | In Access Point mode: HaLow is currently disabled. In Extender mode: device is not associated via HaLow. |
| Purple solid | In Access Point mode: HaLow is currently enabled. In Extender mode: device is currently associated via HaLow. |
| Purple flickering | On both Access Point and Extender, flickers to show HaLow traffic activity. The busier the link, the faster the LED will flicker. |
| Purple slow flashing | Pairing is in progress. |

#### Wi-Fi 2.4 GHz LED

| Color & Behavior | Meaning |
| --- | --- |
| Off | Either the power is off or the 2.4 GHz Access Point is not active. It can be re-enabled via the management interface or restored via a Factory Reset. |
| Green solid | The 2.4 GHz Access Point on the HaLowLink is currently active and available for devices to discover and connect to. |
| Green flickering | On both Access Point and Extender, flickers to show 2.4 GHz traffic activity. The busier the link, the faster the LED will flicker. |

### Ethernet/USB Ports

#### Access Point Mode (Green Status LED)

Regardless of whether the HaLowLink is configured as a Router or just an Access Point, these roles are correct. USB-C and LAN will always be on a separate network to WAN, and the WAN port should be connected to your router.

| Port | Role |
| --- | --- |
| USB-C | Either power only, or connect a computer to get a `192.168.12.x` IP and access the management interface at `https://192.168.12.1`. |
| LAN | Connect a computer to get a `192.168.12.x` IP and access the management interface at `https://192.168.12.1`. |
| WAN | Connect this to your existing network/router. |

#### Extender Mode (Aqua Status LED)

| Port | Role |
| --- | --- |
| USB-C | Either power only, or connect a computer to use the Extender's HaLow connection. |
| LAN | Connect a computer to use the Extender's HaLow connection. |
| WAN | Connect a computer to use the Extender's HaLow connection. |

---

## Frequently Asked Questions

**How can I make my HaLowLink Access Point behave exactly like a standard access point (fully bridged)?**

If you have used the Wizard to change your Network Mode to the recommended _Wi-Fi HaLow devices will get an IP on your existing router's network_ setting, you will have effectively set up a normal bridged Access Point — except for the `lan` management subnet which still hosts the GUI at `https://192.168.12.1`.

If you want your HaLowLink Access Point to behave exactly like a consumer Access Point product (fully bridged), go to the Quick Config page and move all the devices and ports (LAN/2.4/USB) from the `lan` network onto the `wlan` network using the Network Interfaces section.

Ideally, you should do this from the address assigned from your upstream network (i.e. not `192.168.12.1`) to avoid losing access to the device. If you do use `192.168.12.1`, you should use the **Apply Unchecked** option, as otherwise the changes will automatically revert unless you quickly access the UI via the other address in the same browser.

---

**How can I test mesh? (EasyMesh or 802.11s Mesh)**

There are two recommended ways to observe mesh operation using three (3) HaLowLink devices:

1. **Confirm relaying through an intermediate node:** Move Device 1 and Device 2 far enough apart that they can no longer communicate directly, then introduce Device 3 as a mesh peer. Successful communication between Device 1 and Device 2 in this state indicates traffic is being relayed via Device 3.
2. **Demonstrate throughput improvement:** Increase the distance between Device 1 and Device 2 until their throughput decreases significantly, then introduce Device 3 as a mesh peer. An improvement in throughput confirms that the mesh path has been established.

---

**How can I test 802.11s Mesh self-healing when my HaLowLink nodes are too close together?**

Wi-Fi HaLow's primary strength is its range, so it's expected that separating devices enough to observe self-healing behaviour can be difficult. To simulate greater distance between your 802.11s Mesh peers for testing purposes, you can adjust the **RSSI threshold for joining**, which prevents nodes from forming mesh links when the received signal strength is too weak.

1. Set up your 802.11s Mesh.
2. In the **Advanced Config** menu, navigate to the **Wireless** page under the **Network** sub-menu.
3. Click **Edit** on the Mesh Point.
4. Navigate to the **Mesh Settings** tab under the **Interface Configuration** sub-section.
5. Update the **RSSI threshold for joining** field to define an appropriate minimum signal strength (RSSI) a node must detect to establish a peer link in the mesh.
6. Click **Save** on the dialog and then **Save & Apply** on the Wireless page to apply these changes.

---

**How can I limit or increase the number of peers allowed in my 802.11s Mesh?**

Follow the same steps as the previous question up to Step 3. From there you can adjust the **Maximum number of mesh peers**. Note that setting this value to 2 will force the mesh to form a linear chain topology, which is likely not useful.

---

**I changed the mode of an interface on the Quick Config page, and it's refusing to save or not working as expected.**

<Note>
  Before attempting any significant interface modifications on the Quick Config page, you should check that none of the Wizard configurations already meet your needs.
</Note>

This usually happens when trying to attach a non-WDS (Wireless Distribution System / 4-address mode) interface to a WDS bridge (e.g. adding a 2.4 GHz Wi-Fi Client to a HaLowLink Access Point). For technical reasons, only one non-WDS interface (3-address mode) can exist on a bridge interface at a time.

To resolve this error, you can do one of the following:

1. **Remove the non-WDS Wi-Fi client:** The error message describes the offending non-WDS Wi-Fi client which can be removed. If this was just added/modified, you can reset the changes using the **Reset button** in the bottom right corner.
2. **Enable WDS for the Wi-Fi clients (if possible):** From the Wireless subsection you should be able to select **Client (WDS)** as a Mode for your HaLow Wi-Fi client devices only.
3. **Move the non-WDS client to its own network interface:** Go to the Network Interfaces subsection and enter a new network interface name before clicking the **Add** button. You should also click the **Add Zone** button to create a new permissive firewall zone. You can now safely move the offending non-WDS Wi-Fi client onto this new interface.

---

## Troubleshooting

If you're having trouble with your HaLowLink, we recommend [Restoring Factory Settings](#restoring-factory-settings). You can also reach out on the Morse Micro Community Forum to share your issue and get help from our experts and other users.

| Problem | Solution |
| --- | --- |
| The Status LED is not illuminated. | There is a problem with power to the device. Check that the USB-C port on the HaLowLink is connected to the provided power supply or to a USB-C port on a computer. Do not use a USB-A to USB-C adapter. |
| The Status LED is still yellow after some time, or never stops flashing green after boot. | The flash partition is probably corrupt. To recover your HaLowLink, see [Recovering From Failed Updates](#recovering-from-failed-updates) below. |
| I can't access the HaLowLink at `https://192.168.12.1`. | If the status light is **solid green** and you can't access your HaLowLink: make sure your computer is connected to either the LAN or USB port; check that your network connection is configured as a DHCP client and has been allocated a `192.168.12.x` IP; if you're failing to establish a network connection to your device, see [Restoring Factory Settings](#restoring-factory-settings). If the status light is **solid aqua**, your HaLowLink is in Extender mode and will only be useful if connected to an Access Point. |
| I changed a configuration setting and now I can't access my HaLowLink, but I don't want to reset it. | Connect your computer to the LAN or WAN port and configure it with: **IP:**`10.22.121.110`, **Netmask:**`255.255.255.254` (or `255.255.255.0` if your OS doesn't support the former). As long as your HaLowLink has a solid green or aqua light, it will be available at `10.22.121.111` (a secondary static IP assigned for diagnostic purposes). |
| I can see that the Access Point card has connected devices, but the Local Network card doesn't list them. | If you have configured your device as an Access Point only (i.e. the wizard option _Wi-Fi HaLow devices will get an IP on your existing router's network_), then these devices will appear in the DHCP lease table of the existing DHCP server on your network. |
| When I connect my computer to my HaLowLink Extender directly over Ethernet, my internet gets slower. | Most operating systems will prefer a wired connection over any wireless connection. If you're using a HaLowLink Extender, this means you will be restricted to the maximum bandwidth over the HaLow link. Determine how to prefer your existing Wi-Fi connection for your operating system (e.g. via setting the HaLowLink connection to local only, removing the default route from the HaLowLink, or changing the route priorities). |
| When I connect my computer to my HaLowLink directly over Ethernet, my internet stops working. | Your computer is preferring the HaLowLink connection over your wireless connection, but your HaLowLink is not yet connected to the internet. For an Access Point, check the **Uplink** card on the homepage; for an Extender, check it has a purple light AND that the Access Point is correctly configured. |
| I changed the HaLow Mode or Network Mode of my HaLowLink, and my Extenders no longer work as expected. | If you've just changed the Network Mode, we recommend power cycling your Extender to force it to reinitialize. If you've changed the HaLow Mode, you should follow the instructions in the [Extender section](#halow-extender) to reset your device to Extender mode and redo the pairing procedure. |
| My connection isn't performing as I expect. | Check signal strengths on the Access Point by going to the Home page and clicking on the Connected Devices card. For more detailed information, navigate to the **Realtime Graphs** page. To check for interference, check the **Channel Analysis** page. To run `iperf3` or ping tests, use the **Diagnostics** page. |
| My Extender's HaLow Status LED is flashing quickly all the time even when I'm not using it. | Make sure you haven't created a network loop by connecting a LAN/WAN port of your Extender to the same network as your Access Point. To solve this, disconnect the incorrect Ethernet link. |
| I'm seeing strange or confusing behavior not mentioned above. | Make sure you have the latest firmware by enabling Advanced Config, going to the **Upgrade** page and clicking **Check for automatic upgrade**. To report an issue, go to the **Support** page under the **Help** submenu, then click **Create Archive**. You can then post this on the Morse Micro Community Forum. |

### Recovering From Failed Updates

If for some reason the software is corrupted or not booting — most often caused by loss of power during an update — the following procedure will allow a new image to be written to flash.

1. Remove all cables from the device.
2. Attach an Ethernet cable from the HaLowLink directly to your computer.
3. While powered off, **press and hold** the mode button on the HaLowLink.
4. Attach the power cable and turn on power. Watch for the Status LED to turn yellow, then blink white 5 times.
5. Release the button. The LED should remain yellow.
6. Configure your network connection with the following static IP and netmask:
   - **IP address:** `192.168.12.2`
   - **Netmask:** `255.255.255.0`
7. Open a web browser and navigate to `http://192.168.12.1`.
   <Note>
     If you get a **Page Not Found** error, ensure that your URL only contains the IP address, clear your cache, and/or use an Incognito browser.
   </Note>
8. Upload a firmware file and press **update firmware**. A progress screen should appear.
   <Note>
     Despite what the animated spinner might suggest, you can safely navigate away from this page.
   </Note>
9. **Do not remove the power** until the device has installed the firmware and fully booted. You will see the following Status LED patterns to show the progress, in order:
   - Solid purple
   - Red/purple flashing
   - Solid purple
   - Solid red
   - Off (rebooting)
   - Flashing yellow
   - Solid yellow (the start of the normal boot process)

<Note>
  The entire process can take a while to complete (10\+ minutes).
</Note>

---

## Licensing and Source

Much of the software included in the HaLowLink is covered by open source licenses, including the GPLv2. For complete licensing information and access to the source code, go to [morsemicro.com/halowlink](https://morsemicro.com/halowlink).

---

## Regulatory Compliance

### FCC Compliance Statement

**FCC ID: 2A74O-9A6140** and **FCC ID: 2A740-F24F90**

This device complies with Part 15 of the FCC Rules. Operation is subject to the following two conditions: (1) this device may not cause harmful interference, and (2) this device must accept any interference received, including interference that may cause undesired operation.

Changes or modifications not expressly approved by the party responsible for compliance could void the user's authority to operate the equipment.

This equipment has been tested and found to comply with the limits for a Class B digital device, pursuant to Part 15 of the FCC Rules. These limits are designed to provide reasonable protection against harmful interference in a residential installation.

**FCC Radiation Exposure statement:** This equipment complies with FCC radiation exposure limits set forth for an uncontrolled environment. This equipment should be installed and operated with minimum distance 20 cm between the radiator and your body. This transmitter must not be co-located or operating in conjunction with any other antenna or transmitter.

### IC Compliance Statement

This device contains licence-exempt transmitter(s)/receiver(s) that comply with Innovation, Science and Economic Development Canada's licence-exempt RSS(s). Operation is subject to the following two conditions: (1) this device may not cause interference, and (2) this device must accept any interference, including interference that may cause undesired operation of the device.

**ISED Radiation Exposure statement:** This equipment complies with IC RSS-102 radiation exposure limits set forth for an uncontrolled environment. This equipment should be installed and operated with minimum distance 20 cm between the radiator and your body.

**Antenna:** Dipole Antenna, Gain: 2.34 dBi (IC: 6100A-HM593 and 29791-737B5B)

### EU Declaration of Conformity

Hereby, Morse Micro Pty Ltd declares that the radio equipment type HaLowLink 2 is in compliance with Directive 2014/53/EU (RED).

The full text of the EU declaration of conformity is available at [morsemicro.com/resources/declarations](https://www.morsemicro.com/resources/declarations/EU%20Declaration%20of%20Conformity%20for%20MM-HL2-EXT.pdf).