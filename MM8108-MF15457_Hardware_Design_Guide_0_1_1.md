---
title: MM8108-MF15457 Hardware Design Guide
---

# MM8108-MF15457 Hardware Design Guide

The MM8108-MF15457 is a sub-gigahertz transceiver system-on-module (SoM) designed for long-range, low-power wireless communication using [the Wi-Fi HaLow/IEEE 802.11ah standard](https://en.wikipedia.org/wiki/IEEE_802.11ah). It integrates RF baseband, medium access control (MAC) and digital interfaces into a compact, low-power device optimized for embedded and Internet-of-Things (IoT) applications.

The MM8108-MF15457 can integrate with a host application MCU via SDIO or SPI, and GPIOs are provided to support custom, application-specific pins. JTAG (Joint Test Action Group) pins are provided for module programming and diagnostics.

### **About this Guide**

This guide is intended to help hardware designers integrate the MM8108-MF15457 into the products they are engineering. Its specific aim is to share best-practices for schematic design and for PCB-level component placement and trace routing. It does so within a design workflow that has been structured to prioritize the most critical areas over lesser ones so that the design process can proceed smoothly.

It is not a complete reference work. As such, it should be read alongside the [MM8108-MF15457 datasheet](https://www.morsemicro.com/download/mm8108-mf15457-data-sheet/?wpdmdl=255769\&ind=1758247638963\&refresh=f3035620\&filename=MM8108-MF15457_Data_Sheet.pdf) and one or more [Morse Micro reference designs](https://www.morsemicro.com/downloads-dashboard/) to bridge the gap between raw specifications and implementation-specific details. If you prefer more direct design guidance, this is provided by the MM8108-MF15457 Hardware Design Checklist.

| WARNING This guide does not cover regulatory certification, application software or system-level networking architecture. Please [see the datasheet for regulatory information](https://www.morsemicro.com/download/mm8108-mf15457-data-sheet/?wpdmdl=255769\&ind=1758247638963\&refresh=f3035620\&filename=MM8108-MF15457_Data_Sheet.pdf). |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## **Planning and Preparation** <a href="#planning-and-preparation" id="planning-and-preparation"></a>

Faster time to market depends on not only design choices but also the order in which they are made. Sequencing tasks so items with upstream dependencies are started early ensures the necessary information is available when it is needed. When fundamental details relating to component selection, layout constraints or system requirements are left unresolved until later, the result can be redesigns, delays and blocks to progress.

### **Impedance Control**

Ask your chosen PCB manufacturer early in the design process for its recommended coplanar waveguide trace geometry based on the dielectric constant, loss tangent and dielectric thickness associated with their process.

The MM8108-MF15457 is designed for 0.6mm-wide traces with 0.4mm spacing. This makes a 50Ω characteristic impedance achievable on a two-layer board. However, a closely spaced ground plane will significantly reduce the need for tapering the main RF trace connection to the module, meaning that a four-layer stackup can offer signal integrity benefits over a two-layer design. For FR-4 fiberglass substrate, the thickness dielectric between the top copper and ground plane should be in the order of 0.2-0.4mm.

PCB trace geometry is often limited by the smallest-pitch component in the RF chain. Identify these key RF components early and base the impedance-controlled layout around them. Prefer components and connectors with pad widths near 0.6mm as they help minimize impedance mismatches caused by trace-width variation.

Impedance calculation tools and formula-based estimators may be useful for approximating trace dimensions. However, these models are not necessarily derived from exact field solutions; many are empirical or quasi-empirical curve-fits to simulation and measurement data. Manufacturers typically apply their own field solvers and impedance tuning, so collaboration with them is essential. Co-ordinate with your PCB manufacturer before beginning layout so trace geometries don’t require later re-routing. When using multiple vendors, unique trace geometries are required for each vendor.

Advanced simulation tools, such as full-wave 3D solvers, offer greater accuracy than equation-based methods by accounting for geometry, material variation and board-specific features. This level of modeling is warranted when losses or impedance variations of less than 1dB are significant to the application.

### **Component Availability**

Verify the long-term availability and lead times for critical components early in the design process: don’t let supply issues or sudden obsolescence jeopardize your product’s lifecycle. Use the [application examples’ component lists](MM8108-MF15457_Hardware_Design_Guide_0_1_1.md#bill-of-materials) as proxies for budgeting or as the basis for your equivalent application.

If component lead times are shorter than PCB turnaround, focus on rare or non-substitutable parts early and defer broader component ordering until the PCB has been released for fabrication. This allows part procurement to proceed in parallel with PCB fabrication.

### **Antenna Selection**

The antenna will both influence and be influenced by the final enclosure design, which—at the time of hardware design—is likely still evolving. An antenna’s performance depends heavily on its immediate surroundings, including the enclosure, internal cabling, external cabling, nearby metallic structures (including the PCB) and objects in the deployment environment. These factors should be kept in mind throughout the design process to avoid costly redesigns if performance issues are discovered late.

Obtain antenna samples and begin testing early—even while PCB design is underway. Return loss and radiation pattern (gain vs angle) should be measured using a setup that approximates the final enclosure and cabling. Be aware that changes to your enclosure, cables or surrounding environment may force a change in antenna selection—though these elements themselves depend on a PCB layout that is still in development. This interdependency must be managed throughout development.

#### **Antenna Connectors**

If the product interfaces to a standard 50Ω RF connector (as opposed to [an integrated PCB antenna](MM8108-MF15457_Hardware_Design_Guide_0_1_1.md#pcb-antennas)), there are no specific preparation tasks that must be completed before design commences. The PCB designer should focus on maintaining a consistent 50Ω impedance throughout the RF path using best-practice layout techniques. System-level testing still needs to be considered early, as interactions between the antenna, enclosure, cabling and nearby conductive structures will influence performance and affect choices around antenna type, connector placement and enclosure design.

#### **Off-the-Shelf Antennas**

When selecting an off-the-shelf antenna for a Wi-Fi HaLow module, ensure compatibility with the sub-gigahertz frequency range (typically 860-930MHz, depending on region) with a bandwidth of at least 8MHz (again depending on region). Wi-Fi HaLow operates on a wider bandwidth than other common ISM-band technologies (such as LoRa), so take care to check the operating bandwidth of the antenna if it is advertised for use with one of these other technologies. For general-purpose deployment and consistent coverage, a dipole antenna is recommended due to its omnidirectional radiation pattern in the azimuth plane. This facilitates uniform signal strength around the antenna, ideal for applications where the client devices may be distributed readily. Key parameters to consider include antenna gain (typically 1-3dBi for dipoles), connector type (must match the end-product’s or module’s RF interface), mechanical form-factor and environmental rating.

#### **Electrically Small Antennas** <a href="#electrically-small-antennas" id="electrically-small-antennas"></a>

At 915MHz, antennas shorter than \~30mm are considered electrically small and so face significant trade-offs in efficiency, bandwidth gain and susceptibility to de-tuning from nearby materials.

Approach with caution any antenna smaller than a quarter wavelength (approximately 80mm). Below this physical size, impedance matching becomes more sensitive, and performance becomes less predictable and more dependent on enclosure design and nearby conductors. Early validation and testing are essential for antennas below this size threshold. Plan for extensive impedance matching, validation and possibly iterative tuning of the matching network and physical layout to ensure acceptable performance.

#### **PCB Antennas** <a href="#pcb-antennas" id="pcb-antennas"></a>

The performance of a PCB antenna design depends on its manufacturing process, PCB material, enclosure, cabling and other nearby structures. Design parameters—such as the required gain for the power amplifier (PA) and low-noise amplifier (LNA), and the recommended matching topology—are best determined with knowledge of the antenna’s impedance and radiation characteristics.

Plan to design and build early prototypes specifically for antenna evaluation, even before laying out out the full product. These can include the enclosure, dummy connectors, cabling and the antenna section, while omitting other circuitry. Such setups allow return loss and antenna pattern measurements that place the design in the right ballpark. While further adjustments may be expected, this process reduces uncertainty and enables more informed decisions before significant investment in the final layout.

##

## **Module Pinout**

### **Component Land Pattern**

Square pads of uniform size and spacing are recommended.

**PIC**

Dimensions are provided in millimetres (mm) and mil (thou). Where ambiguity exists (e.g., due to rounding), treat the millimetre dimensions as the source of truth.

| Key              | Dimension (mm) | Dimension (mil) |
| ---------------- | :------------: | :-------------: |
| Package X        |      11.0      |       433       |
| Package Y        |      10.0      |       394       |
| Pad X            |       0.6      |        24       |
| Pad Y            |       0.6      |        24       |
| Pad Spacing X    |       1.0      |        39       |
| Pad Spacing Y    |       1.0      |        39       |
| Package to Pad X |       0.5      |        20       |
| Package to Pad Y |       0.5      |        20       |

### **Schematic Symbol**

The diagram below shows a top view of the module package. Pins are numbered clockwise around the package. Please see [the **Pin Details** table](MM8108-MF15457_Hardware_Design_Guide_0_1_1.md#pin-details) below for further information.

**PIC x 2**

#### **Pin Details** <a href="#pin-details" id="pin-details"></a>

| Pin | Name      | Role           | Function                                  | Alternative |
| :-: | --------- | -------------- | ----------------------------------------- | ----------- |
|  1  | GND       | Ground         | Ground                                    |             |
|  2  | ANTENNA   | Analog Antenna |                                           |             |
|  3  | GND       | Ground         | Ground                                    |             |
|  4  | RESET\_N  | Digital I/O    | Asynchronous chip reset (active low)      |             |
|  5  | WAKE      | Digital I/O    | External wake from Deep Sleep and Snooze  |             |
|  6  | JTAG\_TMS | Digital I/O    | JTAG Mode Select                          | `GPIO15`    |
|  7  | JTAG\_TCK | Digital I/O    | JTAG Clock                                | `GPIO13`    |
|  8  | JTAG\_TDO | Digital I/O    | JTAG Data Out                             | `GPIO16`    |
|  9  | JTAG\_TDI | Digital I/O    | JTAG Data In                              | `GPIO14`    |
|  10 | VBAT      | Supply         | 3.3V Supply                               |             |
|  11 | GND       | Ground         | Ground                                    |             |
|  12 | SDIO\_D0  | Digital I/O    | SDIO Data Line                            | `SPI_MISO`  |
|  13 | SDIO\_D3  | Digital I/O    | SDIO Data Line                            | `SPI_CS`    |
|  14 | SDIO\_D1  | Digital I/O    | SDIO Data Line                            | `SPI_INT`   |
|  15 | SDIO\_D2  | Digital I/O    | SDIO Data Line                            |             |
|  16 | SDIO\_CMD | Digital I/O    | SDIO Command Line                         | `SPI_MOSI`  |
|  17 | SDIO\_CLK | Digital I/O    | SDIO Clock Input                          | `SPI_CLK`   |
|  18 | GPIO5     | Digital I/O    | Programmable digital I/O                  |             |
|  19 | GPIO4     | Digital I/O    | Programmable digital I/O                  |             |
|  20 | GND       | Ground         | Ground                                    |             |
|  21 | GPIO3     | Digital I/O    | Programmable digital I/O                  |             |
|  22 | VDDIO     | Supply         | Host Supply for digital I/O               |             |
|  23 | GND       | Ground         | Ground                                    |             |
|  24 | VBAT\_TX  | Supply         | 3.3V Supply                               |             |
|  25 | VDD\_USB  | Supply         | 3.3V USB Supply                           |             |
|  26 | GND       | Ground         | Ground                                    |             |
|  27 | USB\_DN   | Digital I/O    | USB D- Line                               |             |
|  28 | USB\_DP   | Digital I/O    | USB D+ Line                               |             |
|  29 | BUSY      | Digital I/O    | Module is transmitting or processing data |             |
|  30 | GND       | Ground         | Ground                                    |             |
|  31 | GPIO1     | Digital I/O    | Programmable digital I/O                  |             |
|  32 | GPIO0     | Digital I/O    | Programmable digital I/O                  |             |
|  33 | GPIO6     | Digital I/O    | Programmable digital I/O                  |             |
|  34 | GPIO7     | Digital I/O    | Programmable digital I/O                  |             |
|  35 | GPIO8     | Digital I/O    | Programmable digital I/O                  |             |
|  36 | GPIO9     | Digital I/O    | Programmable digital I/O                  |             |
|  37 | GPIO10    | Digital I/O    | Programmable digital I/O                  |             |
|  38 | GND       | Ground         | Ground                                    |             |

##

## **Schematic Design**

The example schematic below includes all the components required for a typical MM8108-MF15457 design, including power supply decoupling, external components for the buck converter and crystal oscillators. It should be borne in mind while you proceed through this section.

Designing the remaining schematics starts with [the RF signal path](MM8108-MF15457_Hardware_Design_Guide_0_1_1.md#rf-signal-path) and then [the USB signal path](MM8108-MF15457_Hardware_Design_Guide_0_1_1.md#usb-signal-path). Once these are in place, complete the power supply, decoupling capacitors, IO configuration, diagnostics, and protection circuitry.

### **RF Signal Path** <a href="#rf-signal-path" id="rf-signal-path"></a>

Your product’s RF domain should be your primary design consideration. It represents the device’s core function and is one of the design’s more challenging aspects.

#### **Impedance Control** <a href="#impedance-control" id="impedance-control"></a>

RF nets between MM8108-MF15457 and antenna should be designated as impedance-controlled (50Ω characteristic impedance) in the schematic editor to ensure the correct routing constraints are applied during layout.

#### **Antenna and Associated Matching**

Matching is not required if an off-the-shelf 50Ω antenna is used or the RF output is simply routed to a 50Ω connector. The best performance is achieved by routing directly, with a short trace from the RF output to the connector. However, many designers choose to include a placeholder ‘pi’ (shown below) or ‘tee’ network. This introduces a performance trade-off (wider pads, extra trace length and additional components leading to added mismatch, loss and cost) in exchange for the flexibility to allow for filtering or attenuation if issues arise later in the development process.

If the antenna is **not** 50Ω (as is often the case with [electrically short PCB antennas](MM8108-MF15457_Hardware_Design_Guide_0_1_1.md#electrically-small-antennas)) then impedance matching becomes mandatory. A generic pi or tee network can be included to facilitate matching, which poses minimal effort for a roughly matched system. However, the optimal matching circuitry will depend on the exact impedance presented by the antenna, including the PCB, inside the enclosure, and deployed in a representative scenario. It is advisable to produce antenna-only PCB prototypes and utilize a Vector Network Analyzer (VNA) to measure the system performance; this data will be needed to implement optimized front-end matching.

When designing a small form-factor PCB antenna, changes in the antenna geometry will affect the load presented by the (unmatched) antenna. To the extent this may be influenced by design decisions, the top (shaded) region of the Smith chart below is recommended, as it may be matched using purely capacitive matching, which behaves more ideally (exhibiting less loss and less magnetic coupling) than inductive matching.

###

### **Radio Frequency Front End**

For most applications, the only component required at the `ANTENNA` port is a single, 902-928MHz (863-868MHz in the EU) 50Ω antenna.

More advanced applications may require additional circuitry, but this is outside the scope of this guide.

### **USB Signal Path** <a href="#usb-signal-path" id="usb-signal-path"></a>

USB design should be the next area you consider, so that a more reliable and robust product may be produced. It should not be left until you start work on [general interfacing](MM8108-MF15457_Hardware_Design_Guide_0_1_1.md#interfacing).

USB nets between MM8108-MF15457 and connector should be designated as length-matched to within 1mm and impedance-controlled (90Ω differential characteristic impedance) in the schematic editor to ensure the correct routing constraints are applied during layout. For USB-C the `CC` lines should be designated as impedance-controlled (50Ω characteristic impedance) and these signals should have particular attention paid to any schematic design elements that may produce reflections on the signal line.

| WARNING USB signal integrity issues can be particularly hard to find because they often result in subtle non-specific error modes such as slower data rates or intermittent unexpected behavior; as such, it is recommended that they be designed with best practice principles to avoid difficulty later. Specific care should be taken when placing any components in series with the USB lines (such as ESD protection or switching). These components must be specifically designed for use in USB 2.0 applications, as general purpose components can significantly impede USB signal integrity. |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### **Decoupling Capacitors**

The `VBAT`, `VBAT_TX` and `VDD_USB` pins should be decoupled with a 10μF ceramic capacitor and a 100nF ceramic capacitor, both rated for at least 6.3V. This is shown below. Either X7R or X5R are recommended.

The `VDDIO` pin should be decoupled with a 100 nF ceramic capacitor, rated for at least 6.3 V. Either X7R or X5R are recommended.<br>

| WARNING The effective capacitance of ceramic capacitors can drop significantly under applied DC bias, especially in smaller packages. For example, a nominal 4.7µF capacitor in an 0402 package may deliver less than 2µF at 3.3V. When selecting capacitors for bulk storage, consult the manufacturer’s bias de-rating curves to ensure that sufficient capacitance remains available under load. If necessary use a larger case size or a higher voltage rating to reduce the percentage loss. |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### **Power Supply**

The performance of the MM8108-MF15457 depends critically on the quality and stability of its power supply. While the device includes internal regulators to generate the required internal voltages, it is sensitive to droop, ripple and noise on the primary voltage supply.

The voltage supply should remain within the 3.0-3.6V range across all load conditions (from sleep currents to peak TX current) and under expected variations in input supply. Gradual shifts in power supply voltage (e.g., from a battery discharging) are tolerated by the internal low dropout (LDO) regulator and buck converters. However, high-frequency noise on the supply remains a critical consideration for RF performance.

| INFO `VDDIO` is tolerant of voltages as low as 2.25V. Appropriate level shifting circuitry must be employed if you are interfacing with systems that operate at lower voltages, such as 1.8V. |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

The MM8108-MF15457 is typically powered by an external voltage regulator, which should have an output ripple below 30mV peak-to-peak, and supply at least 500mA continuously. If a switch-mode power supply is used, it is strongly recommended that you include a footprint for an RF shielding can that fully encloses its perimeter. This allows you to fit a shield to suppress radiated emissions and preserve receiver sensitivity, if required.

### **Interfacing** <a href="#interfacing" id="interfacing"></a>

#### **USB**

USB signal integrity considerations [are discussed above](MM8108-MF15457_Hardware_Design_Guide_0_1_1.md#usb-signal-path).

#### **SDIO/SPI**

The MM8108-MF15457 supports communications via SDIO or SPI, each of which has its own firmware. MM8108-MF15457 [pins 12 through 17](MM8108-MF15457_Hardware_Design_Guide_0_1_1.md#pin-details) are configured for SDIO/SPI.

| Pin | Name       | SDIO 4-bit mode   | SDIO 1-bit mode   | SPI mode   |
| :-: | ---------- | ----------------- | ----------------- | ---------- |
|  12 | `SDIO_D0`  | Data pin 0        | Data pin          | `SPI MISO` |
|  13 | `SDIO_D3`  | Data pin 3        |                   | `SPI_CS`   |
|  14 | `SDIO_D1`  | Data pin 1        | IRQ               | `SPI_INT`  |
|  15 | `SDIO_D2`  | Data pin 2        |                   |            |
|  16 | `SDIO_CMD` | Command pin       | Command Pin       | `SPI_MOSI` |
|  17 | `SDIO_CLK` | Clock pin (input) | Clock pin (input) | `SPI_SCLK` |

| INFO 25MHz is a typical SPI clock speed. Take extra care if any clocks in your design operate at or near this frequency. The 37th harmonic of 25MHz is 925MHz, which falls within the ISM (Industrial, Scientific and Medical) band used by Wi-Fi HaLow. |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

**SPI**

This schematic demonstrates the use of SPI to connect an MM8108-MF15457 to an application MCU.

When selecting an MCU, you will achieve the best throughput if the host supports:

* Level-triggered interrupts.
* Full-duplex SPI mode.
* DMA-backed transactions on the SPI bus.

Standard SPI can achieve up to 25Mbps at 50MHz, but not without DMA support. For example, an SPI interface with an 8-byte buffer per transaction might only achieve 2Mbps.

For proper operation, and to take advantage of the MM8108-MF15457’s power-saving features, connect `RESET_N` and `WAKE` to standard digital outputs (at CMOS logic levels), and the `BUSY` signal to a digital input (also at CMOS logic levels). Do not use open-collector or open-drain circuits, as they will cause incorrect behavior.

**SDIO**

This schematic demonstrates the use of SDIO to connect an MM8108-MF15457 to an application MCU.

The `SDIO_CLK` line must not include a pull-up resistor. The remaining SDIO lines (`SDIO_CMD`, `SDIO_D0`, `SDIO_D1`, `SDIO_D2` and `SDIO_D3`) must be pulled up to `VDDIO` using resistors between 10kΩ and 100kΩ. The responsibility of providing these resistors falls on the host side. However, if the host does not provide them, or its implementation is uncertain, it is acceptable to place the resistors on the MM8108-MF15457 side to ensure correct logic levels.

SDIO traces should be routed with 50Ω characteristic impedance. Basic length matching to within 10mm is also recommended. If signal integrity issues are observed, such as excessive trace length or overshoot, series damping resistors of 10-100Ω may be beneficial. Where signal behaviour is unknown at design time, footprint provisions for 0Ω resistors, as shown below, can be included to preserve the option to correct signal integrity issues discovered during verification.

When multiple host controllers are supported through different build options, it is critical to include explicit 0Ω resistors (or similar jumpers) to disconnect unused signal paths from the SDIO lines. Simply leaving an unused host controller interface unpopulated is insufficient—the signal traces should be physically isolated to prevent unterminated stubs that can cause signal reflections and degrade SDIO signal integrity.

#### **GPIO**

The MM8108-MF15457 provides 11 GPIO pins to meet application-specific requirements. They are not user-programmable. Instead their operation is governed by custom module firmware and board configuration files (BCFs) which Morse Micro can develop on request.

When enabled, GPIO signals operate at low speeds and do not typically require strict routing constraints for signal integrity. However, in applications where fast edge rates are present, attention should be given to trace length, return path continuity and termination.

#### **Digital Pins with Special Functions**

* `WAKE` This is an input used to bring the module out of deep sleep and snooze modes. It is part of the `VBAT` analog domain and cannot be driven by anything less than 3.0V. Caution must be taken when the host controller operates using `VDDIO` below 3.0V to ensure appropriate level-shifting is employed when driving `WAKE`.
* `RESET_N` The active-low reset pin should be connected to a power-on reset network consisting of a 220kΩ pull-up resistor and a 2.2µF capacitor to ground. This ensures that the MM8108-MF15457 is properly initialized on power-up. The `RESET_N` pin can also be driven low by an external device to reset the device.

### **Diagnostic Headers**

For robust design and subsequent troubleshooting, include a 16-pin header. Morse Micro uses a [Samtec FTSH-108-01-F-D-K](https://suddendocs.samtec.com/productspecs/clp-ftsh.pdf) configured with the pinout shown below to allow access for potential diagnostics.

The following pin configurations are recommended:

| Pin | Net            | Description                       |
| :-: | -------------- | --------------------------------- |
|  1  | `VDDIO`        | Digital domain power rail         |
|  2  | `GND`          | Ground                            |
|  3  | `MM_JTAG_TDI`  | JTAG TDI                          |
|  4  | `MM_JTAG_TDO`  | JTAG TDO                          |
|  5  | `MM_JTAG_TCK`  | JTAG TCK                          |
|  6  | `MM_JTAG_TMS`  | JTAG TMS                          |
|  7  | `MM_JTAG_TRST` | JTAG reset                        |
|  8  | `MM_RESET_N`   | Device reset                      |
|  9  | `MM_GPIO2`     | Debug                             |
|  10 | `MM_GPIO3`     | Debug                             |
|  11 | `MM_SD_CLK`    | SPI clock                         |
|  12 | `MM_SD_CMD`    | SPI controller out, peripheral in |
|  13 | `MM_SD_D0`     | SPI controller in, peripheral out |
|  14 | `MM_SD_D3`     | SPI chip select                   |
|  15 |                | Not connected                     |
|  16 | `MM_WAKE`      | Wake up                           |

| WARNING While a diagnostics port is not required for normal device operation, if no debug access is provided in the design, the ability for Morse Micro to support, diagnose, or resolve technical issues will be reduced. |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

####

#### **Reduced Diagnostics**

In designs where a full diagnostics header is not feasible, a reduced interface is supported. This consists of a 10-position 1.27mm pitch connector with the following connection:

### **Protection Options**

You may choose to incorporate into your design protection against unexpected conditions, such as electrostatic discharge (ESD), reverse polarity, over-voltage, over-current, brown-out, etc.

Standard best-practice ESD protection is recommended on all nets exposed to the external environment. Place protection at the outermost connectors, not directly at the MM8108-MF15457 pins.

Avoid placing ESD components on the RF trace to preserve signal integrity by minimizing parasitic shunting and impedance discontinuities. For the antenna trace in particular, 1kV of ESD protection is already provided by the MM8108-MF15457. If additional ESD protection is required, the selected TVS diode must have an input capacitance less than 0.2pF, and its footprint should preserve controlled-impedance geometry without introducing abrupt transition on the PCB RF trace.

The MM8108-MF15457 is rated for 3.0–3.6V. For nominal operation at 3.3V, voltage clamping to 3.4–3.6V is sufficient to protect the device from supply transients. The module does not include reverse polarity protection, so this must be implemented externally in systems where reverse polarity may occur (e.g., a user inserting a battery backwards). If adding voltage clamping or reverse polarity protection to a design, consider any trade-offs such as additional leakage currents. This is particularly important for low-power or battery-operated applications, where minimizing power consumption is critical.

##

## **PCB Layout**

With the schematic in place, we now come to the recommended workflow for the PCB layout engineer. Again, start with the most critical elements (RF) down to the least (GPIO), beginning with placement and then tackling routing. By completing one section before moving to the next, this process naturally ensures that the most important parts receive the most favorable design trade-offs.

We start with some PCB layout examples before turning to the component placement and routing process in detail.

### **Radio Frequency**

The RF section should be the primary layout consideration. We recommended you route it first to ensure it naturally receives the most favorable design trade-offs.

#### **Placement Guidelines**

Start with the antenna, then any other RF components (if applicable) and finally the Wi-Fi HaLow transceiver module. This allows the RF section to be tightly packed with short, direct traces. During this process many design trade-offs will emerge, and we’ll consider these next.

**Path Length**

Place RF components close to keep traces as short as possible in order to:

* Reduce insertion loss, improve transient settling and minimize electromagnetic interference.
* Limit the round-trip path for reflections, allowing signals to settle more quickly after a transition.
* Reduce the physical aperture available for radiated emissions or coupling to adjacent circuitry.

| INFO Longer traces introduce greater resistive and dielectric loss, which reduces efficiency. |
| --------------------------------------------------------------------------------------------- |

As a guideline, RF traces should be kept significantly shorter than one-tenth of the signal wavelength in the PCB dielectric. For typical coplanar waveguide or microstrip traces on FR4 at 915MHz, this corresponds to approximately 15mm. Traces longer than this threshold must be treated with increased attention to impedance control and layout. However, minimizing length is beneficial in all cases: Ohmic and dielectric losses scale directly with trace length, and even short traces will exhibit improved efficiency and reduced insertion loss when length is minimized.

**Current Loops**

Orient and place components that connect to ground (like decoupling capacitors or terminations) so their ground pads are as close as possible to vias or traces leading to the ground plane. Minimize the area enclosed by the signal and its return path, as this reduces loop inductance and magnetic coupling. This is shown below. Component placement should ensure that PCB traces are not routed beneath the antenna, RF feedline and any other RF front end circuitry.

**Separation from Noise Sources**

Keep RF components and traces well separated from all other circuitry. As a general guideline, maintain at least 10mm clearance from other components and traces, and maximize distance to switching regulators, high-speed digital lines and potential electromagnetic interference sources. Layout choices should prioritize clean isolation, especially in sensitive receive paths or matched impedance networks, because even low-level coupling can degrade performance. It is advisable to define explicit keep-out zones around RF traces, matching networks and the RF front-end-module to prevent electromagnetic coupling and preserve circuit isolation.

**Parasitic Impedances**

Remember that PCB traces introduce parasitic inductance, while component pads add parasitic capacitance. Extra trace length is generally less critical for inductors, just as added copper area has less impact on capacitors. Knowing in advance whether a matching network will require inductors or capacitors (rather than relying on generic pi or tee footprints) allows placement and routing to minimize parasitic inductance at capacitors and parasitic capacitance at inductors.

**Inductor Considerations**

Careful placement and orientation of inductors is essential to minimize magnetic coupling, which can degrade RF performance or inject noise into sensitive circuits. When multiple inductors are used in proximity (such as RF matching inductors and DC-DC converter inductors) their coils should be placed with orthogonal orientations. Avoid placing inductors with parallel coil axes, as this maximizes coupling. Maintaining physical separation between inductors further reduces coupling risk. These considerations are especially important during RF reception, when the system is most sensitive to low-level noise. In this state, any coupling between switching inductors and RF paths can compromise receiver performance. In particular, inductors inside matching circuits can act as antennas that pick up radiated noise.

**Matching Component Considerations**

Matching components should be placed as close to the unmatched element (e.g., the antenna) as possible. PCB traces before (or between) the matching components should not be viewed as conventional 50Ω transmission lines, so keep these traces to a minimum length to reduce unwanted impedance transformation. Some advanced matching techniques may intentionally introduce phase shifts using this approach. However, such techniques are outside the scope of this guide.

**PCB Antenna Considerations**

Follow the antenna manufacturer’s recommended keep-out dimensions carefully and measure antenna performance (including return loss and radiation pattern) as part of the design process. Keep in mind that PCB layout, nearby structures, and the enclosure can significantly influence antenna behavior and the specific interactions of your product are not captured in the antenna datasheet.

**Shielding**

The MM8108-MF15457 ships with an RF shielding can over the RF circuitry. Additional Wi-Fi HaLow RF shielding is usually not required, except in advanced applications. Switch-mode power supplies may require additional shielding cans. Keep in mind that inductors are particularly prone to radiate and receive noise, and during RF receive, even low-level coupled noise can degrade sensitivity or introduce spurious responses. The shield should fully enclose the sensitive region, with a solid via-stitched ground perimeter to ensure good RF sealing. Large openings or poorly grounded shields can significantly compromise effectiveness.

The primary purpose of shielding is to prevent emissions from other system components (particularly high-speed digital switching, or RF) from coupling into the antenna path and degrading receiver sensitivity. The MM8108-MF15457 is capable of detecting signals as low as –107dBm, so even very weak internal emissions can raise the noise floor and limit system performance. Effective shielding should form a continuous seal. The limiting factor in shielding effectiveness is typically the largest dimension of any aperture or discontinuity in the shield—not the overall coverage percentage. Shielding with large openings often provides little benefit and can introduce resonances or coupling paths that degrade performance. At 915MHz (λ≈328 mm), the reactive near field extends approximately 50mm from any source of interference. Within this region, electromagnetic energy can couple into the antenna even in the absence of a direct line-of-sight path (fields can diffract, wrap around shielding edges, or penetrate narrow slots).

#### **Routing Guidelines**

Once component placement is complete, begin routing the RF traces. Each RF trace can significantly impact system performance and EMC/EMI compliance, so route them with care.

**Impedance Control**

We have already recommended that you commence communications with your PCB manufacturer [early in the design process](MM8108-MF15457_Hardware_Design_Guide_0_1_1.md#planning-and-preparation) to establish the required PCB routing rules, and that you designate [RF nets as 50Ω in your schematic design tool](MM8108-MF15457_Hardware_Design_Guide_0_1_1.md#impedance-control). Now that you are routing the PCB traces, hopefully you’ve heard back from your manufacturer, so be sure to apply these routing rules to the 50Ω characteristic impedance Wi-Fi HaLow signal traces.

**Bend Angle**

Smoothly curved or 45° bends in RF traces are preferred. Sharp corners can introduce discontinuities; gradual transitions support consistent impedance and clean signal propagation. A 45° bend or continuous curve provides a more uniform current path, reducing the chance of localized reflections or unintended radiation.

**Reference Plane Integrity**

Route RF traces exclusively over an uninterrupted ground plane—do not place RF traces over plane splits, gaps, other traces, or isolated copper pours. An unbroken ground plane provides a consistent return path directly beneath the RF trace, which is essential for stable impedance and minimizing unintended radiation.

**Via Usage and Transitions**

RF paths should remain on the outermost copper layer and avoid layer transitions via vias. Routing RF traces entirely on the surface avoids introducing impedance discontinuities and parasitic via inductances. Layer changes inherently degrade signal integrity and are strongly discouraged in RF paths. If an unavoidable mechanical constraint forces a layer change, only then should a single, properly sized via be used, with minimal stub length, and impedance-matched barrel and antipad dimensions.

**Via Shielding**

Coplanar waveguide (CPW) traces should be flanked on both sides by a continuous fence of closely spaced ground vias. This via fencing confines the electromagnetic fields, suppresses parallel-plate modes, and maintains a robust and continuous return path, which minimizes undesired coupling and radiation. Vias should be positioned as close to the edge of the CPW ground metal as practical, ideally within 0.5-1.0mm. Denser via spacing improves mode suppression and helps ensure consistent impedance and field confinement along the CPW structure.

**Thermal Relief and Power-Plane Intersections**

For optimal signal integrity, ground vias associated with RF signals should use a solid copper pour rather than thermal relief patterns. This ensures the lowest possible return path impedance and minimizes parasitic effects. However, solid vias can conduct significant heat during soldering, potentially causing assembly challenges or unreliable joints. Thermal reliefs alleviate this risk by limiting heat conduction—but at the expense of RF performance. We recommend retaining a solid ground connection and addressing assembly concerns through process tuning or other local design adjustments.

**Component Pad Transitions**

When transitioning to a wider pad, an abrupt and well-controlled impedance transition is preferable, particularly when coordinated with an appropriate ground return (such as removing some of the ground layers under the pad, if needed). Tapered transitions may look cleaner but often do not improve impedance matching and can worsen reflections.

In the examples shown above, the RF feedline is designed for a 50Ω characteristic impedance, referenced to an internal ground plane. However, the RF connector pad is significantly wider than the feedline. To maintain the 50Ω impedance at this interface, the internal ground layers are removed beneath the pad, shifting the reference plane to the bottom layer. On the left, an abrupt transition is shown: the trace width and ground reference shift simultaneously and this preserves a consistent 50Ω impedance across the transition. The tapered trace on the right, however, while still referenced to the internal plane, experiences gradual impedance drop to below 50Ω before returning once the bottom-layer ground plane takes over at the pad. This non-uniform impedance can introduce reflections and degrade RF performance.

The best results are achieved by avoiding unnecessary trace-width discontinuities altogether. Selecting components (e.g., 0402 passives) and connectors whose pad dimensions are as close as possible to the desired trace width is recommended. However, the trace width is also typically constrained by the need to mate with the device’s interface geometry (e.g., the required pad or bump size), which may impose a minimum trace width. In practice, the thinnest component pad width often determines the trace width, which in turn defines the PCB stackup and transmission line type (e.g., CPW or microstrip).

Transitions to larger connector geometries (such as SMA or U.FL) can introduce impedance discontinuities due to differences in pad size compared to the RF trace width. These transitions should ideally be measured using a vector network analyzer (VNA) to verify return loss and ensure acceptable matching. While full 3D electromagnetic simulation is not mandatory, it can be a valuable tool for predicting performance and reducing the number of layout iterations needed to optimize RF performance.

### **USB**

With data rates up to 480Mbps, USB signals are technically 240MHz radio-frequency signals, and should be treated as such. Being a digital signal protocol, signal losses can be boosted or recovered, which makes signal loss less critical (compared to an RF antenna trace) but the differential signal nature means length matching becomes an important consideration. USB signals must be routed according to the [length-matching](MM8108-MF15457_Hardware_Design_Guide_0_1_1.md#path-length) and [impedance-control](MM8108-MF15457_Hardware_Design_Guide_0_1_1.md#impedance-control) rules defined above.

For USB-C, abrupt transitions in the `CC` signals (including vias) should be avoided wherever possible. Any imperfections in these signal traces can send reflections to the host controller that may cause it to incorrectly interpret the discontinuity as a sign there is no peripheral device connected.

### **Decoupling**

After the RF and USB traces, the next most important consideration is the bypass capacitors. Standard best-practice principles apply, as discussed below, and demonstrated in this example:

#### **Placement Guidelines**

Decoupling capacitors are most effective when placed to minimize loop area between the capacitor and its associated supply pin. All capacitors should be located as close as practical to their associated pins or supply nodes. When multiple capacitors are placed in parallel at the same pin (for example, a 100nF alongside a 4.7µF) it may be acceptable to place them side by side or to stack them vertically (i.e., on opposite sides of the PCB with a via connection). What matters most is minimizing the inductance of the conductance path and ensuring both capacitors return to a solid ground plane. For designs with long or resistive supply paths on `VBAT`, placing sufficient bulk capacitance close to the device is especially important to ensure that transient current demands are supported locally.

#### **Routing Guidelines**

Use short, wide copper traces to both power and ground. A ground via should be placed as close as practical to the capacitor ground terminal to connect directly to a continuous ground plane located on the layer below the chip. This ground plane must be unbroken within the area enclosed by the outermost grounding vias of the module and its decoupling capacitors, to provide a well-defined low-impedance current return path.

### **Power Supply**

With the decoupling capacitors applied, it is now time to turn to the rest of the power supply architecture.

#### **Placement Guidelines**

Placement should aim to simultaneously minimize power supply noise and series resistance. Any noise on the power supplies may be coupled into the RF section of the design and then radiated out of the antenna. This can impact receive sensitivity and also cause the device to fail certification testing.

**Equivalent Series Resistance**

Equivalent series resistance (ESR) may be reduced by placing the power supply—particularly if it is a low dropout regulator (LDO)—close to the `VBAT` pin.

**Separating Noisy Sources from Sensitive Circuitry**

If using a switch-mode power supply, place it as far from the Wi-Fi HaLow module as practical. This applies broadly to any circuitry generating high-frequency currents through inductors or ground paths. If ESR in the main supply path is a concern, providing a Kelvin connection to the voltage feedback pin can help mitigate voltage drops.

#### **Routing Guidelines**

The routing of power supply traces directly influences voltage stability, noise coupling and how effectively decoupling performs under dynamic load.

**Star Topology Distribution**

Keep all common mode impedance to a minimum. Power distribution should avoid daisy-chaining and instead use a star-point or short branch to deliver equal quality supply to each load. This is required for `VBAT`, `VBAT_TX` and `VDD_USB`, which serve distinct functional domains and must be routed independently from a shared node. Each branch must include its own local decoupling network placed close to the associated power pin. The physical layout should favor short, direct traces from the star point to each load. Route traces to the capacitor pads first and then to the device pin.

**Trace Width and Thickness**

Power supply traces should be designed for both low resistance and low inductive impedance to support fast current transients without significant voltage droop. The maximum recommended series resistance on the `VBAT` current path is 50mΩ. The PCB layout should ensure that this limit is not exceeded, taking into account the resistance of the copper traces as well as any series components present in the power path. Using wider copper traces (or better yet, polygon pours) minimizes voltage drop due to DC resistance and reduces inductive impedance at higher frequencies. This becomes especially important during events such as RF transmission or wake-from-sleep transitions, where dynamic current demand can rise sharply. Supply voltage drop between the regulator and the load should remain below 50 mV under peak current conditions. Avoid routing supply traces through narrow necks, unnecessary detours, or shared segments that may introduce excess impedance or coupling into other supply domains.

Avoid overlapping power traces on adjacent layers, which can create capacitive coupling between supplies.

**Via Usage**

Each via contributes its own resistance and inductance, so spreading current across several vias ensures that power integrity is maintained even under fast load steps. This is particularly important for `VBAT` and `VBAT_TX`.

### **SDIO/SPI/JTAG**

Placement and routing should minimize crosstalk and signal integrity issues across these digital interfaces. It is important to address this carefully during layout because digital signals may appear functional despite poor integrity, often leading to intermittent or hard-to-diagnose failures later in development, or in the field. The following recommendations help maintain clean digital signaling.

#### **Placement Guidelines**

Wherever possible, arrange subsystems on the PCB to allow direct, uncluttered routing of the SDIO/SPI signals, minimizing crossings with other traces or with each other. Maintain separation between these signal domains to reduce coupling and simplify layout.

#### **Routing Guidelines**

The SDIO and SPI signals should ideally be routed as a 50Ω coplanar waveguide (on outer layers) or as stripline (on internal layers). To preserve signal integrity, keep trace lengths under 50mm and match them within ±10mm. Being digital signals, resistive and dielectric losses are not a key concern, so minimum trace width and dielectric type are not critical.

These interfaces run at tens of megahertz, so tight impedance control is not necessary. However, using a standard PCB calculator to size traces for nominal 50Ω is still recommended. Coordination with the PCB fabricator for precise impedance control on these traces is not mandatory.

SDIO is a point-to-point protocol and should always be routed directly between the host and peripheral without any branches in the signal path. When supporting multiple host devices through different builds (for example, by selectively populating 0Ω resistors), the stub leading to the unused path should be kept as short as possible to maintain signal integrity.

For SPI and JTAG, which are shared buses, arranging devices in a daisy chain helps minimize reflections and ensures the last device sees the best signal. You should note that intermediate devices inevitably see stubs from the onward connections.

### **GPIO**

GPIO signals have lower priority than other types, so they are typically routed last, using whatever space remains after higher-priority traces are placed. Ensure their routing doesn’t violate existing layout constraints—for example, avoid cutting ground planes beneath RF traces or disrupting return current loops. GPIO pins’ function is defined by special firmware builds and Morse Micro board configuration files (BCF). If tied to a specific application note, any unique signal requirements will be detailed there.

Electrically, a GPIO driven on one end is effectively grounded at the driver but floating (high impedance) at the load. From the standpoint of nearby RF traces, it resembles a length of unterminated copper that can easily pick up or reradiate signals. If the trace is long or closely spaced to RF, it can act like a stray antenna. Adding 100pF capacitors to ground can suppress these effects without impacting low-speed digital performance.

For GPIO signals that control external RF front-end devices such as RF switches, front-end modules (FEMs), low noise amplifiers (LNAs) and power amplifiers (PAs), ensure to place 100pF termination capacitors at the RF front-end device control input pins. These capacitors filter digital power supply domain noise and prevent this noise from coupling into the RF front-end signal path.

If GPIO traces need to cross on adjacent layers, or cross over power traces, ensure they do so at right angles to minimize coupling. GPIO traces should only run directly alongside other traces if those signals are tolerant of digital noise, or if GPIO transitions are guaranteed to occur at times that coupling is not consequential.

### **Diagnostic Ports**

Placement and routing of the diagnostics connector should ensure reliable mechanical fit, allow unobstructed cable access and maintain a clean integration into the PCB stack-up without compromising nearby traces or ground integrity. Place the diagnostics connector with enough clearance for cables or probes to attach and detach freely. Avoid positions that force sharp cable bends.

### **Protection**

Placement and routing of protection components must ensure effective suppression of electrostatic discharge, electromagnetic interference and conducted noise without compromising impedance control or power delivery.

#### **Placement Guidelines**

Electrostatic discharge protection (ESD) protection components must be placed to intercept disturbances before they propagate into sensitive areas of the design. ESD protection circuitry should be located at the outermost interface with the external environment, close to connectors or antenna feeds, ensuring transients are shunted quickly through short, direct paths to ground.

As signals transition between noisy and quiet domains, chokes and filters confine conducted noise, preserving the integrity of downstream circuits. On impedance-sensitive traces, particularly RF paths, any protection must be positioned to minimize parasitic effects and maintain controlled impedance without introducing discontinuities. Similarly, on power nets, protection layout must accommodate wide copper traces to keep ESR low, preventing voltage drops and avoiding inductive artifacts that could degrade supply stability.

#### **Routing Guidelines**

Route to protection devices with the shortest possible traces to minimize series impedance. Avoid tight corners or via transitions that introduce additional parasitics, particularly on RF or high-current power nets. Ensure ground returns are direct and connect to a solid plane to support effective discharge and filtering.

### **Grounding**

Ground layout directly impacts power integrity, electromagnetic interference performance and RF behavior. The following section describes layout techniques and grounding practices necessary to ensure stable operation. Many of the recommendations are repeated, but they have been gathered together here as a final grounding integrity checklist to be reviewed before the board is sent for manufacture.

#### **Solid Ground Plane**

Dedicate at least one layer (typically an inner layer) as a continuous ground plane. Avoid cutting or slotting the ground plane near critical components or between supply and decoupling points. Keep the ground plane unbroken under the MM8108-MF15457, associated decoupling capacitors and RF trace. If signals must transition between layers, space out adjacent vias to prevent splits in the ground plane. A single, unified ground plane should be maintained throughout. Do not segment or isolate analog and digital grounds within the module footprint.

#### **Ground Via Stitching**

Use generous ground via stitching to connect all ground regions and layers. Every decoupling capacitor should have at least one ground via placed directly at the capacitor pad. Where possible, via-in-pad is preferred. Ground vias should be placed densely around exposed thermal pads, the periphery of the chip, and beneath any high-current return paths such as the buck regulator or RF output. Add ground vias at every ground pad, for every grounded component. For RF nets, use a direct connection (not a thermal relief).

In systems operating in the 850-950MHz band, the wavelength in FR4 is approximately 150mm. To effectively confine return currents and suppress cavity resonances, stitching vias should be placed at least every 15mm (about λ/10). However, for improved margin and to further minimize electromagnetic interference risk, a tighter pitch of 6mm or less (approximately λ/25) is recommended.

Along critical signals (such as around RF or high-speed traces) vias should be spaced no more than 1.0mm apart (center to center). Recommended via dimensions include a minimum drill size of 0.3mm and a pad diameter of at least 0.6mm, using annular rings that meet fabrication requirements. Place stitching vias every 3.0mm along plane boundaries and within 1.0mm of any cutout or slot.

#### **Return-Path Control**

All high-speed or RF signal traces must have a direct return path on the adjacent ground layer. Return current should remain closely coupled beneath the signal trace. Traces must not cross plane splits.

##

## **Application Example**

To demonstrate one outcome of the techniques and methods described above, the following reference design provides a MM8108-MF15457-based USB-connected Wi-Fi HaLow adapter. We make a number of reference designs available to customers—this is the one with the fewest components.

Here is the complete PCB. The RF, USB, decoupling and IO (LED) traces are clearly visible. The power supply and button are not shown—they are on the underside of the PCB.

### **Schematics**

Here are the required decoupling capacitors, the RF antenna connector and the reset circuitry:

The power supply is taken directly from the 5V USB `VBUS` line. A switch mode power supply (U2) has been used to minimize production of waste heat.

Finally, some basic indicator LEDs are included, along with a push button (not implemented in the layout above) for `WAKE` functionality:

### **Bill of Materials** <a href="#bill-of-materials" id="bill-of-materials"></a>

The reference design utilizes the following components.

| Board Designator | Value | Manufacturer                | Part Number          | Quantity |
| ---------------- | ----- | --------------------------- | -------------------- | :------: |
| H2               | USBA  | Global Connector Technology | USB1061-GF-L-A       |     1    |
| D1, D5           | Green | SunLED                      | XZVGR68W-3           |     2    |
| D6               |       | STMicroelectronics          | ESDALC6V1-1U2        |     1    |
| D2, D3           |       | Littelfuse                  | SP3522-01ETG         |     2    |
| D4               | Red   | SunLED                      | XZMDK68W-2           |     1    |
| C1               | 2.2µF | Murata                      | GRM155R61E225ME15D   |     1    |
| C2, C4, C6       | 10µF  | Samsung                     | CL05A106MP5NUNC      |     3    |
| C5               | 22pF  | TDK                         | CGA2B2NP01H220J050BA |     1    |
| R2               | 453k  | Vishay                      | CRCW0402453KFKEDC    |     1    |
| R7               | 220k  | Yageo                       | RC0201FR-07220KL     |     1    |
| C3, C8           | 10µF  | Murata                      | GRM188R61E106MA73J   |     2    |
| C7               | 100nF | KEMET                       | C0402C104K8RACTU     |     1    |
| H1               |       | Bel Cinch                   | 142-0761-861         |     1    |
| L1               | 2.2µH | Murata                      | LQM21PN2R2MGHL       |     1    |
| R1, R3           | 100k  | Yageo                       | RC0402FR-07100KL     |     2    |
| R4, R5, R13      | 330R  | Yageo                       | RC0201FR-07330RL     |     3    |
| U1               |       | Morse Micro                 | MM8108-MF15457       |     1    |
| U2               |       | Diodes Inc.                 | AP3401DNTR-G1        |     1    |

### **Other Application Examples**

Many other MM8108-MF15457 applications and reference designs are available, including [a development board based around the STMicro STM32U585 MCU](https://www.morsemicro.com/download/mm8108-ekh05-v2-design-package/?wpdmdl=256605\&ind=1759464476186\&refresh=f2226272\&filename=MM8108-EKH05_v2.1.zip) and [a Wi-Fi HaLow add-on for a Raspberry Pi Linux computer](https://www.morsemicro.com/download/mmech17-design-package/?wpdmdl=256601\&ind=1773890214545\&refresh=f2805a7e\&filename=MMECH17_v4.0.zip).

Please see [the Morse Micro website’s download area](https://www.morsemicro.com/downloads-dashboard/) for all our example applications.

##

## **Additional Resources**

Complete details for this application example can be found at [www.morsemicro.com](http://www.morsemicro.com) and searching for the RD09 reference design.

### **IC Datasheets**

* [Morse Micro MM8108-MF15457 Datasheet](https://www.morsemicro.com/download/mm8108-mf15457-data-sheet/?wpdmdl=255769\&ind=1758247638963\&refresh=f3035620\&filename=MM8108-MF15457_Data_Sheet.pdf)
* [Diodes AP3401DNTR-G1 Datasheet](https://au.mouser.com/datasheet/3/175/1/AP431_A.pdf)

### **Design Guidance**

* MM8108-MF15457 Hardware Design Checklist
