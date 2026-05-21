# **MM6108 SoC Data Sheet**

Wi-Fi HaLow / IEEE 802.11ah | Sub-1 GHz 1/2/4/8 MHz Bandwidth | MAC/PHY/Radio SoC

## **Table of Contents**

1. [Product Overview](#product-overview)
   - [Introduction](#introduction)
   - [Features](#features)
   - [Applications](#applications)
2. [Pin Descriptions](#pin-descriptions)
3. [Functional Description](#functional-description)
   - [Functional Block Diagram](#functional-block-diagram)
   - [Clocks](#clocks)
   - [Power Management](#power-management)
4. [Digital Interfaces](#digital-interfaces)
   - [SDIO Device](#sdio-device)
   - [SPI Device](#spi-device)
   - [GPIO](#gpio)
   - [Sleep/Wake Sequencing](#sleepwake-sequencing)
5. [Electrical Characteristics](#electrical-characteristics)
   - [Absolute Max Ratings](#absolute-max-ratings)
   - [Immunity](#immunity)
   - [Recommended Operating Conditions](#recommended-operating-conditions)
   - [Power Consumption](#power-consumption)
   - [RF Specifications](#rf-specifications)
   - [Digital Specifications](#digital-specifications)
6. [Package Information](#package-information)
7. [PCB Land Pattern](#pcb-land-pattern)
8. [Solder Stencil Pattern](#solder-stencil-pattern)
9. [Recommended Soldering Profile](#recommended-soldering-profile)
10. [Packaging and Labeling](#packaging-and-labeling)
11. [Handling and Storage](#handling-and-storage)
12. [Part Number and Ordering Information](#part-number-and-ordering-information)
13. [Revision History](#revision-history)

---

## **1 Product Overview** {#product-overview}

### **1.1 Introduction** {#introduction}

Wi-Fi HaLow (pronounced HEY-low) is the first global Wi-Fi standard (IEEE 802.11ah) tailored to meet Internet of Things (IoT) needs. It is an open standard wireless network technology operating in the sub-1 GHz license-exempt RF bands (850–950 MHz range), so it does not incur ongoing monthly costs like cellular/mobile network connections. By operating in the sub-GHz range, this ultra-low-power wireless protocol can connect more IoT devices at much longer distances and with much lower power than traditional Wi-Fi.

Morse Micro, the world's leading Wi-Fi HaLow (802.11ah) solutions provider, offers several Wi-Fi HaLow connectivity solutions. The MM6108 SoC is a single-chip solution that includes Radio, PHY, and MAC functions compliant with the IEEE 802.11ah standard and supports data rates up to 32.5 Mbps. The radio in the MM6108 supports programmable operation between 850 MHz and 950 MHz.

The MM6108 has been designed for a simplified Wi-Fi HaLow connection to an external host.

The RF interface for the MM6108 includes the option to use either the on-chip amplification for typical low-power, low-cost devices or in conjunction with an external PCB mounted power amplifier for ultra-long-reach applications.

The RF receiver features a high linearity LNA, making external filters unnecessary in many applications.

MM6108 supports security features required for Wi-Fi HaLow product certifications.

A combination of features in the MM6108 supports battery-operated applications. The IEEE 802.11ah standard provides extended sleep times of battery-operated Stations (STAs or client devices), with longer durations than other prior IEEE 802.11a/b/g/n/ac generations. It also allows longer extended maximum idle times for clients to conserve energy without being removed from the Access Point's list of authenticated devices.

### **1.2 Features** {#features}

* Single-stream max data rate of 32.5 Mbps (MCS=7, 64-QAM, 8 MHz channel, 4μs GI)
* Radio supporting worldwide Sub-1 GHz frequency bands
  * Frequency range: 850–950 MHz
  * Channel bandwidth options of 1/2/4/8 MHz
  * Max output power: 8 dBm
* 802.11ah OFDM PHY
  * BPSK & QPSK, 16-QAM & 64-QAM Modulation
  * Automatic frequency & gain control
  * Packet detect & channel equalization
  * Forward Error Correction (FEC) coding & decoding
  * Supports Modulation and Coding Scheme (MCS) levels MCS 0–7 and MCS 10
  * Supports 1 MHz duplicate mode
  * Supports optional Traveling Pilots and Short Guard Intervals
* 802.11ah MAC supporting WFA HaLow certification
  * Support for STA and AP roles
  * Listen-Before-Talk (LBT) access with energy detect
  * 802.11 power save
  * 802.11 fragmentation and defragmentation
  * Packet aggregation
  * Power-Saving Target Wake Time (TWT) support for long battery life
  * Restricted Access Window (RAW)
  * Automatic and manual MCS rate selection
* SDIO 2.0 compliant slave interface
  * SDIO 2.0 Default Speed (DS) at 25 MHz
  * SDIO 2.0 High Speed (HS) at 50 MHz
  * Support for both 1-bit and 4-bit data mode
  * Support for SPI mode operation
* Power Management Unit (PMU) for various modes of operation
  * Power-down (interrupt-driven wake)
  * Hibernate mode (internal/external wake)
  * Active Receive / Transmit mode
  * Integrated DC-DC converter supporting a voltage supply from 3.0V to 3.6V
* RF Interface
  * On-chip 8 dBm output power, with option to use external PA or FEM
  * Option to use an external LNA or FEM
* Wide spectrum of security features
  * AES encryption engine
  * Hardware support for SHA1 and SHA2 hash functions (SHA-256, SHA-384, SHA-512)
  * WPA3, including protected management frames (PMF)
  * Opportunistic Wireless Encryption (OWE)

### **1.3 Applications** {#applications}

For Internet of Things (IoT) and Machine-to-Machine (M2M) applications such as:

* Surveillance Cameras and Sensors
* Cloud Connectivity
* Low-power Sensor Networks
* Building Automation Systems (BAS)
* Asset Tracking and Management
* Machine Performance Monitors & Sensors
* Building Access Control & Security
* Drone Video and Navigation
* Connected Toys and Games
* Rural Internet Access
* Agricultural and Farm Networks
* Utility Smart Meter and Intelligent Grid
* Proximity Sensors
* Industrial Automation Controls
* Smart Home Automation
* EV Car Chargers
* Appliances
* Construction Site Connectivity
* Smart Signs and Kiosks
* Retail Point-of-Sale Terminals
* Vehicle-to-Vehicle or Vehicle-to-Infrastructure Communications
* IP Sensor Networks
* Biometric IDs and Keypads
* Warehouse Connectivity
* Intelligent Lighting Controls
* BT/ZigBee™/Z-Wave™ to Wi-Fi HaLow Gateways
* Wi-Fi to Wi-Fi HaLow Bridges
* Wi-Fi HaLow Client Adapters/Dongles
* Smart City Networks

---

## **2 Pin Descriptions** {#pin-descriptions}

The MM6108 device has 48 pins, which are described in this section.

| **Pin** | **Pin Name** | **Type** | **Description** |
| :---- | :---- | :---- | :---- |
| 1 | GND | Ground | Ground |
| 2 | GND | Ground | Ground |
| 3 | GPAIO | Analog | Analog test pin |
| 4 | GND | Ground | Ground |
| 5 | RFIN | RF | RF input |
| 6 | GND | Ground | Ground |
| 7 | RFOUT | RF | RF output |
| 8 | CAPR | Power | Bypass capacitor connection for RF supply |
| 9 | WAKE [4] | Input | WAKE from sleep input |
| 10 | RESET_N [4] | Input | Asynchronous chip reset (active low) |
| 11 | VBAT_PWR | Power | IC Power Supply |
| 12 | IND | Analog | Inductor connection for integrated power management |
| 13 | VBUCK_FB | Power | Connection for integrated power management |
| 14 | VBUCK | Power | Connection for integrated power management |
| 15 | VBAT_AON | Power | IC Power Supply (VBAT_AON and VBAT_PWR must be connected to the same source) |
| 16 | CAPD | Power | Bypass capacitor connection for digital supply |
| 17 | BUSY [5] | Digital I/O | Wi-Fi Busy |
| 18 | GPIO1 [5] | Digital I/O | GPIO |
| 19 | GPIO2 [5] | Digital I/O | GPIO |
| 20 | GPIO3 [5] | Digital I/O | GPIO |
| 21 | GPIO4 [5] | Digital I/O | GPIO |
| 22 | GPIO5 [5] | Digital I/O | GPIO |
| 23 | GPIO6 [5] | Digital I/O | GPIO |
| 24 | VDDIO | Power | VDD supply for digital IO |
| 25 | SDIO_D3 [3][5] | Digital I/O | SDIO Data 3 |
| 26 | SDIO_D2 [3][5] | Digital I/O | SDIO Data 2 |
| 27 | SDIO_D1 [3][5] | Digital I/O | SDIO Data 1 |
| 28 | EXT_HOST_SEL [5] | Digital I/O | External Host Select |
| 29 | SDIO_D0 [3][5] | Digital I/O | SDIO Data 0 |
| 30 | SDIO_CMD [3][5] | Digital I/O | SDIO Command |
| 31 | SDIO_CLK [5] | Digital I/O | SDIO Clock |
| 32 | GPIO7 [2][5] | Digital I/O | GPIO |
| 33 | GPIO8 [2][5] | Digital I/O | GPIO |
| 34 | GPIO9 [2][5] | Digital I/O | GPIO |
| 35 | GPIO10 [2][5] | Digital I/O | GPIO |
| 36 | GPIO11 [2][5] | Digital I/O | GPIO / RF FEM CTRL |
| 37 | GPIO12 [2][5] | Digital I/O | GPIO / RF FEM CTRL |
| 38 | GPIO13 [2][5] | Digital I/O | GPIO / RF FEM CTRL |
| 39 | GPIO14 [2][5] | Digital I/O | GPIO / RF FEM CTRL |
| 40 | GPIO15 [2][5] | Digital I/O | GPIO / RF FEM CTRL |
| 41 | JTAG_TDO [1] | Digital I/O | JTAG Data Out |
| 42 | JTAG_TMS [1] | Digital I/O | JTAG Mode Select |
| 43 | JTAG_TDI [1] | Digital I/O | JTAG Data In |
| 44 | JTAG_TRST [1] | Digital I/O | JTAG Reset |
| 45 | JTAG_TCK [1] | Digital I/O | JTAG Clock |
| 46 | XON | Analog | 32 MHz crystal component connection |
| 47 | XOP | Analog | 32 MHz crystal component connection |
| 48 | XTAL_BIAS | Analog | Crystal Bias |
| — | GND | Ground | Exposed ground pad — must connect to PCB ground |

**Table 1: Pin description**

1. JTAG pins should be tied to GND via a 10k pull down resistor.
2. All unused GPIO should be tied to GND via a 10k pull down resistor.
3. All SDIO bus pins should be pulled up with a 10k–100k resistor as per the SDIO standard.
4. Supplied from VBAT domain. The VDDIO domain drives other pins.
5. See Section 4.1 for the GPIO Alternate functions.

---

## **3 Functional Description** {#functional-description}

The following sections describe the functions of the MM6108 SoC.

### **3.1 Functional Block Diagram** {#functional-block-diagram}

The MM6108 integrates a Sub-GHz RF Frontend, PHY (including packet detection, channel equalization, FFT, demodulation, FEC decode/encode, and scrambling), MAC layer with AES encryption, a Wi-Fi HaLow API, an SDIO/SPI Slave Interface, and a Power Management & Deep Sleep Unit — all driven by a 32 MHz XTAL.

### **3.2 Clocks** {#clocks}

The MM6108 uses a 32 MHz crystal component to derive all the clocks used in the system. A Pierce oscillator circuit is used. The crystal should be connected between pins XOP and XON. Load capacitors C1 and C2 should be high-accuracy NP0 dielectric. The total capacitance on XOP and XON nodes should be twice that of the load capacitance specified by the crystal component (CL):

**C1 = C2 = 2 × CL**

To adhere to 802.11ah standards for frequency offset and achieve specified sensitivity, the crystal component should conform to the following specifications:

| **Parameter** | **Min** | **Max** | **Units** |
| :---- | :---- | :---- | :---- |
| Frequency tolerance | -20 | +20 | ppm |
| ESR | 10 | 50 | ohm |

**Table 2: RF crystal specification**

### **3.3 Power Management** {#power-management}

All power is derived from a 3.0V to 3.6V supply on pin VBAT_PWR and VBAT_AON. To avoid damage to the device, ensure that VDDIO does not exceed VBAT.

An internal buck converter requires a 10 uH inductor between pins IND and VBUCK_FB and ceramic decoupling capacitors.

There are three internal power supplies: RF, Analog, and Digital. Internal circuits regulate these and require ceramic decoupling capacitors on the PCB at CAPR, CAPD, and VBAT_AON.

| WARNING For regular boot operation, ensure that the JTAG_TRST pin is held in reset by pulling it to ground with a 10 kΩ resistor. |
| :---- |

---

## **4 Digital Interfaces** {#digital-interfaces}

### **4.1 SDIO Device** {#sdio-device}

A host interface is available via SDIO 2.0, operating at 3.3V at either default or high speed. To expose the SDIO interface pins, pin 28 EXT_HOST_SEL must be pulled up to VDDIO, indicating the presence of an external host.

#### **4.1.1 Pins**

| **Pin** | **Name** | **SDIO 4-bit mode** | **SDIO 1-bit mode** |
| :---- | :---- | :---- | :---- |
| 25 | D3 | Data pin 3 | Unused |
| 26 | D2 | Data pin 2 | Unused |
| 27 | D1 | Data pin 1 | IRQ |
| 28 | EXT_HOST_SEL | SDIO/SPI/QSPI interface enable strap (tie high) | — |
| 29 | D0 | Data pin 0 | Data pin 0 |
| 30 | CMD | Command pin | Command pin |
| 31 | CLK | Clock pin (input) | Clock pin (input) |

**Table 3: SDIO pin description**

| NOTE All SDIO lines should be pulled up to VDDIO with 10 kΩ to 100 kΩ resistors as per the SDIO 2.0 Specification. SDIO_CLK and unused pins should also be pulled up to achieve ideal sleep/snooze currents if not driven by a host processor. |
| :---- |

#### **4.1.2 Functions**

Internally, the SDIO will present two functions (in addition to the mandatory function 0) to access the chip. Functions 1 and 2 only differ in the maximum transfer size they support. Function 1 can perform transactions up to 8 bytes at a time, while Function 2 supports up to 512 bytes at a time, making it better suited to bulk data transfers.

#### **4.1.3 Bus Timing**

The SDIO interface supports a clock rate up to 50 MHz.

| **Parameter** | **Min** | **Max** | **Units** |
| :---- | :---- | :---- | :---- |
| Clock frequency | 0 | 50 | MHz |
| Clock low time (tWL) | 7 | — | ns |
| Clock high time (tWH) | 7 | — | ns |
| Clock rise time (tLH) | — | 3 | ns |
| Clock fall time (tHL) | — | 3 | ns |
| Input setup time (tISU) | 6 | — | ns |
| Input hold time (tIH) | 2 | — | ns |
| Output delay (tODLY(max)) | — | 14 | ns |
| Output hold time (tODLY(min)) | 2.5 | — | ns |
| Total system capacitance for each line | — | 40 | pF |

**Table 4: SDIO Bus Timing**

### **4.2 SPI Device** {#spi-device}

The SPI interface uses the physical unidirectional pin layout defined below, and it communicates using the modified SDIO protocol.

#### **4.2.1 Pins**

| **Pin** | **Name** | **SPI mode function** |
| :---- | :---- | :---- |
| 25 | CS | Chip select (active low) |
| 26 | NC | Not connected/unused (tie to VDDIO) |
| 27 | INT | Interrupt pin |
| 28 | EXT_HOST_SEL | SDIO/SPI/QSPI interface enable strap (tie to VDDIO) |
| 29 | MISO | Master data in/slave data out |
| 30 | MOSI | Master data out/slave data in |
| 31 | CLK | Clock pin (input) |

**Table 5: SPI pin description**

#### **4.2.2 Initialization in SPI Mode**

After powering on, the host interface can be either SDIO or SPI. To switch to SPI mode, the host must send a CMD0 while holding CS low (asserted).

For further details on the protocol, see SD Specification Part E1, "SDIO Simplified Specification," version 2.00.

#### **4.2.3 SPI Bus Timing**

The SPI clock rate supports up to 50 MHz. The SPI bus timing is identical to the SDIO bus timing, where MOSI and MISO are input and output timing in the SDIO timing specification.

The SPI bus defaults to clock idling at logical 0 (CPOL=0), and data is launched and captured on the positive edges of the clock, as per the SDIO high-speed mode. After being initialized, it may be configured to behave like CPHA=0 (drive output on the negative edge, sample on the positive edge).

### **4.3 GPIO** {#gpio}

There are 16 GPIO pins. These will be high-impedance at reset and during power save modes. These pins should be pulled up/down or driven to ensure the lowest sleep currents.

### **4.4 Sleep/Wake Sequencing** {#sleepwake-sequencing}

#### **4.4.1 Host Wakes MM6108 from Sleep**

1. The driver raises the wake pin and waits for a static period of 10 ms before initializing the shared communication bus and initiating host interface activity.
2. After completing communication, the driver will wait a static period (b) before lowering the wake pin (assuming no further communication has occurred). Depending on the nature of the communication (802.11 data vs. commands), this period can range from 5 to 90 ms.
3. After the wake pin has fallen, the MM6108 will wait for a period (c) before initiating hardware sleep. This dynamic period will differ depending on the power-saving protocol and other chip-specific factors.

#### **4.4.2 MM6108 Wakes Host from Sleep (with Host Interface Disabled)**

1. The MM6108 wakes from sleep and realizes it needs to pass traffic or an event to the host. It begins by asserting the busy pin.
2. The busy pin will fire an interrupt on the host, after which the host will immediately:
   a. Raise the Wake PIN.
   b. Wait a static period of 10 ms.
   c. Initialize/enable the shared host interface.
3. After asserting the busy pin, the MM6108 will initiate host interface communication immediately. It does not wait until the host enables the shared host interface.
4. The busy pin will drop immediately once the MM6108 no longer needs to converse with the host. The host will wait a static period (b) before dropping the wake pin.
5. After the wake pin has fallen, the MM6108 will wait for a period (c) before initiating hardware sleep.

#### **4.4.3 MM6108 Initiates Communication with the Host (Host Interface Enabled)**

1. The MM6108 was previously woken by the host for communication.
2. Sometime after wake and host→MM6108 communication, the MM6108 realizes it needs to send data back to the host. It will assert the busy pin.
3. The busy pin will fire an interrupt on the host, after which it will immediately process the interrupt but take no further action, as the wake pin has already been asserted and the shared host interface is currently enabled/initialized.
4. After MM6108→host communication completion, hardware sleep will be initiated as described above.

---

## **5 Electrical Characteristics** {#electrical-characteristics}

### **5.1 Absolute Max Ratings** {#absolute-max-ratings}

| WARNING Stress beyond the absolute maximum ratings may cause permanent damage to the device. Functional operation is guaranteed for recommended operating conditions only. |
| :---- |

| **Parameter** | **Min** | **Max** | **Unit** |
| :---- | :---- | :---- | :---- |
| VBAT voltage | -0.3 | 4.3 | V |
| Voltage on digital I/O pin | -0.3 | 4.3 | V |
| Voltage on analog/RF pin | -0.3 | 1.32 | V |
| Storage Temperature | -40 | 125 | °C |
| RF Input Power (CW) | — | 6 | dBm |

**Table 6: Absolute max ratings**

### **5.2 Immunity** {#immunity}

| **Parameter** | **Min** | **Max** | **Unit** |
| :---- | :---- | :---- | :---- |
| ESD — Human body model (HBM), ANSI/ESDA/JEDEC JS001 — RF Input | -500 | 500 | V |
| ESD — Human body model (HBM), ANSI/ESDA/JEDEC JS001 — All other pins | -2000 | 2000 | V |
| ESD — Charged device model (CDM), JESD22-C101 — All pins | -500 | 500 | V |

**Table 7: Immunity**

### **5.3 Recommended Operating Conditions** {#recommended-operating-conditions}

| **Parameter** | **Min** | **Typ** | **Max** | **Unit** |
| :---- | :---- | :---- | :---- | :---- |
| Ambient Temperature (MM6108IQ) | -40 | 25 | 85 | °C |
| VBAT / VBAT_AON [2] | 3.0 | 3.3 | 3.6 | V |
| VDDIO [1] | 1.62 | 3.3 | 3.6 | V |
| Digital I/O voltage | 0 | 3.3 | VDDIO | V |

**Table 8: Recommended operating conditions**

1. VDDIO should not exceed VBAT.
2. VBAT_AON should be greater than or equal to VBAT during power-up.

### **5.4 Power Consumption** {#power-consumption}

#### **5.4.1 Transmit Power Consumption**

| **Mode** | **Condition: TA=25°C, VBAT/VDDIO=3.3V** | **Min (mA)** | **Typ (mA)** | **Max (mA)** |
| :---- | :---- | :---- | :---- | :---- |
| Transmit (MCS7, 3 dBm, 100% D.C.) | 1 MHz channel | 33 | 43 | 53 |
| Transmit (MCS7, 3 dBm, 100% D.C.) | 2 MHz channel | 39 | 45 | 52 |
| Transmit (MCS7, 3 dBm, 100% D.C.) | 4 MHz channel | 46 | 52 | 60 |
| Transmit (MCS7, 3 dBm, 100% D.C.) | 8 MHz channel | 56 | 63 | 76 |
| Transmit (MCS0, 6 dBm, 100% D.C.) | 1 MHz channel | 43 | 58 | 76 |
| Transmit (MCS0, 6 dBm, 100% D.C.) | 2 MHz channel | 37 | 47 | 60 |
| Transmit (MCS0, 6 dBm, 100% D.C.) | 4 MHz channel | 45 | 54 | 62 |
| Transmit (MCS0, 6 dBm, 100% D.C.) | 8 MHz channel | 57 | 67 | 77 |

**Table 9: Transmit power consumption**

#### **5.4.2 Receive Power Consumption**

| **Mode** | **Condition: TA=25°C, VBAT/VDDIO=3.3V** | **Min (mA)** | **Typ (mA)** | **Max (mA)** |
| :---- | :---- | :---- | :---- | :---- |
| Listen | 1 MHz channel | 22 | 26 | 31 |
| Listen | 2 MHz channel | 24 | 28 | 33 |
| Listen | 4 MHz channel | 27 | 32 | 38 |
| Listen | 8 MHz channel | 32 | 37 | 43 |
| Active receive MCS7 | 1 MHz channel | 24 | 26 | 35 |
| Active receive MCS7 | 2 MHz channel | 28 | 30 | 39 |
| Active receive MCS7 | 4 MHz channel | 34 | 40 | 46 |
| Active receive MCS7 | 8 MHz channel | 45 | 53 | 61 |
| Active receive MCS0 | 1 MHz channel | 20 | 26 | 35 |
| Active receive MCS0 | 2 MHz channel | 26 | 28 | 36 |
| Active receive MCS0 | 4 MHz channel | 30 | 36 | 46 |
| Active receive MCS0 | 8 MHz channel | 45 | 48 | 59 |

**Table 10: Receive power consumption**

#### **5.4.3 Sleep Power Consumption**

| **Mode** | **Condition: TA=25°C, VBAT/VDDIO=3.3V** | **Min** | **Typ** | **Max** | **Unit** |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Snooze | RC Oscillator on, Memory retained, configurable wake up timer | 9.5 | 42 | 370 | uA |
| Deep sleep | RC Oscillator on, configurable wake up timer | 0.8 | 1 | 1.8 | uA |
| Hibernate | Power off, wait for external interrupt | 0.03 | 0.05 | 1 | uA |

**Table 11: Sleep power consumption**

#### **5.4.4 DTIM3 Power Consumption**

Condition: TA=25°C, VBAT/VDDIO=3.3V, 102.4 ms Beacon Interval

| **Mode** | **Channel** | **Min (uA)** | **Typ (uA)** | **Max (uA)** |
| :---- | :---- | :---- | :---- | :---- |
| S1G beacons | 1 MHz | 370 | 385 | 395 |
| S1G beacons | 2 MHz | 370 | 385 | 395 |
| S1G beacons | 4 MHz | 265 | 275 | 285 |
| S1G beacons | 8 MHz | 265 | 275 | 285 |
| S1G beacons with proprietary DTIM signaling | 1 MHz | 170 | 188 | 200 |
| S1G beacons with proprietary DTIM signaling | 2 MHz | 170 | 188 | 200 |
| S1G beacons with proprietary DTIM signaling | 4 MHz | 165 | 175 | 185 |
| S1G beacons with proprietary DTIM signaling | 8 MHz | 165 | 175 | 185 |

**Table 12: DTIM3 power consumption**

#### **5.4.5 DTIM10 Power Consumption**

Condition: TA=25°C, VBAT/VDDIO=3.3V, 102.4 ms Beacon Interval

| **Mode** | **Channel** | **Min (uA)** | **Typ (uA)** | **Max (uA)** |
| :---- | :---- | :---- | :---- | :---- |
| S1G beacons | 1 MHz | 135 | 140 | 155 |
| S1G beacons | 2 MHz | 135 | 140 | 155 |
| S1G beacons | 4 MHz | 95 | 105 | 120 |
| S1G beacons | 8 MHz | 95 | 105 | 120 |
| S1G beacons with proprietary DTIM signaling | 1 MHz | 80 | 85 | 100 |
| S1G beacons with proprietary DTIM signaling | 2 MHz | 80 | 85 | 100 |
| S1G beacons with proprietary DTIM signaling | 4 MHz | 75 | 80 | 95 |
| S1G beacons with proprietary DTIM signaling | 8 MHz | 75 | 80 | 95 |

**Table 13: DTIM10 power consumption**

### **5.5 RF Specifications** {#rf-specifications}

#### **5.5.1 Frequency Range**

The MM6108 radio operates in the frequency range from 850 MHz to 950 MHz, covering the upper sub-1 GHz band.

| **Region** | **Sub-1 GHz Bands Available (MHz)** | **Total BW Available (MHz)** |
| :---- | :---- | :---- |
| USA | 902–928 | 26 |
| Europe | 863–868, 917.4–919.4 | 7 |
| Australia | 915–928 | 13 |
| Japan | 915.9–928.1 | 11 |
| Singapore | 866–869, 920–925 | 8 |
| India | 865–868 | 3 |

**Table 14: Global frequency bands**

#### **5.5.2 Receiver**

##### **5.5.2.1 Sensitivity**

Sensitivities for 10% packet error rate, 1000 byte packets.

| **MCS** | **Modulation** | **Coding Rate** | **1 MHz (Mbps)** | **2 MHz (Mbps)** | **4 MHz (Mbps)** | **8 MHz (Mbps)** | **1 MHz (dBm)** | **2 MHz (dBm)** | **4 MHz (dBm)** | **8 MHz (dBm)** |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 10 | BPSK | 1/2 x 2 | 0.17 | N/A | N/A | N/A | -107 | N/A | N/A | N/A |
| 0 | BPSK | 1/2 | 0.33 | 0.72 | 1.5 | 3.3 | -105 | -103 | -101 | -97 |
| 1 | QPSK | 1/2 | 0.67 | 1.4 | 3.0 | 6.5 | -102 | -100 | -97 | -93 |
| 2 | QPSK | 3/4 | 1.0 | 2.2 | 4.5 | 9.8 | -99 | -97 | -95 | -91 |
| 3 | 16-QAM | 1/2 | 1.3 | 2.9 | 6.0 | 13 | -96 | -94 | -91 | -88 |
| 4 | 16-QAM | 3/4 | 2.0 | 4.3 | 9.0 | 20 | -93 | -90 | -88 | -85 |
| 5 | 64-QAM | 2/3 | 2.7 | 5.8 | 12 | 26 | -89 | -87 | -84 | -80 |
| 6 | 64-QAM | 3/4 | 3.0 | 6.5 | 14 | 29 | -88 | -85 | -83 | -79 |
| 7 | 64-QAM | 5/6 | 3.3 | 7.2 | 15 | 33 | -87 | -84 | -81 | -77 |

**Table 15: Receiver sensitivity**

##### **5.5.2.2 Adjacent Channel Rejection**

Adjacent channel rejection is measured by setting the requested signal's strength 3 dB above the rate-dependent sensitivity and raising the power of the interfering signal until 10% PER is caused for a PSDU length of 256-byte packets.

| **BW (MHz)** | **MCS** | **Modulation** | **Coding Rate** | **Adjacent Channel Rejection (dB)** | **IEEE Spec (dB)** |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 4 | 0 | BPSK | 1/2 | 16 | 34 |
| 4 | 2 | QPSK | 3/4 | 11 | 23 |
| 4 | 4 | 16-QAM | 3/4 | 4 | 21 |
| 4 | 7 | 64-QAM | 5/6 | -2 | 3 |
| 8 | 0 | BPSK | 1/2 | 16 | 26 |
| 8 | 2 | QPSK | 3/4 | 11 | 24 |
| 8 | 4 | 16-QAM | 3/4 | 4 | 23 |
| 8 | 7 | 64-QAM | 5/6 | -2 | 10 |

**Table 16: Adjacent channel rejection**

#### **5.5.3 Transmitter**

| NOTE The following transmit power levels are for IEEE compliance for 802.11ah. This does not consider any backoffs needed to adhere to regional spectrum compliance (e.g. FCC, IC, TELEC). |
| :---- |

| **Tx Output Power (1, 2 MHz BW)** | **Min (dBm)** | **Typical (dBm)** | **Max (dBm)** |
| :---- | :---- | :---- | :---- |
| MCS 0 | 5.3 | 6.4 | 7.4 |
| MCS 7 | 1.4 | 2.8 | 4.1 |

**Table 17: Transmitter output**

### **5.6 Digital Specifications** {#digital-specifications}

| **Parameters** | **Description** | **Min** | **Max** | **Unit** |
| :---- | :---- | :---- | :---- | :---- |
| VIL_nRST | Reset threshold | — | 450 | mV |
| t0 | Time between VBAT brought up (3.3V) and RESET_N being activated | 50 | — | μs |
| t1 | Duration of RESET_N signal level < VIL_nRST to reset the chip | 1000 | — | μs |
| tB | Boot Time | — | 6 | ms |

**Table 18: Digital specifications**

| **Parameters** | **Description** | **VDDIO** | **Min** | **Max** | **Unit** |
| :---- | :---- | :---- | :---- | :---- | :---- |
| VIL_GPIO | Low input threshold for all GPIO and SDIO pins | 1.8 | -0.3 | 0.63 | V |
| VIL_GPIO | Low input threshold for all GPIO and SDIO pins | 2.5 | -0.3 | 0.7 | V |
| VIL_GPIO | Low input threshold for all GPIO and SDIO pins | 3.3 | -0.3 | 0.8 | V |
| VIH_GPIO | High input threshold for all GPIO and SDIO pins | 1.8 | 1.17 | 3.6 | V |
| VIH_GPIO | High input threshold for all GPIO and SDIO pins | 2.5 | 1.7 | 3.6 | V |
| VIH_GPIO | High input threshold for all GPIO and SDIO pins | 3.3 | 2.0 | 3.6 | V |
| VOL_GPIO | Low output voltage for all GPIO and SDIO pins (8 mA load) | 1.8 | 0.13 | 0.38 | V |
| VOL_GPIO | Low output voltage for all GPIO and SDIO pins (8 mA load) | 2.5 | 0.10 | 0.27 | V |
| VOL_GPIO | Low output voltage for all GPIO and SDIO pins (8 mA load) | 3.3 | 0.08 | 0.18 | V |
| VOH_GPIO | High output voltage for all GPIO and SDIO pins (8 mA load) | 1.8 | 1.34 | 1.70 | V |
| VOH_GPIO | High output voltage for all GPIO and SDIO pins (8 mA load) | 2.5 | 2.20 | 2.41 | V |
| VOH_GPIO | High output voltage for all GPIO and SDIO pins (8 mA load) | 3.3 | 3.07 | 3.23 | V |
| VOL_SDIO | Low output voltage for all SDIO pins (8 mA load) | 1.8 | 0.17 | 0.52 | V |
| VOL_SDIO | Low output voltage for all SDIO pins (8 mA load) | 2.5 | 0.14 | 0.36 | V |
| VOL_SDIO | Low output voltage for all SDIO pins (8 mA load) | 3.3 | 0.11 | 0.24 | V |
| VOH_SDIO | High output voltage for all SDIO pins (8 mA load) | 1.8 | 1.19 | 1.67 | V |
| VOH_SDIO | High output voltage for all SDIO pins (8 mA load) | 2.5 | 2.10 | 2.39 | V |
| VOH_SDIO | High output voltage for all SDIO pins (8 mA load) | 3.3 | 2.99 | 3.21 | V |

**Table 19: Digital specifications**

---

## **6 Package Information** {#package-information}

### **6.1 Package Dimensions** {#package-dimensions}

| **Description** | **Symbol** | **Min (mm)** | **Nom (mm)** | **Max (mm)** |
| :---- | :---- | :---- | :---- | :---- |
| Package Type | — | QFN | — | — |
| Pin Count | — | 48 | — | — |
| Total Thickness | A | 0.80 | 0.85 | 0.90 |
| Stand Off | A1 | 0 | 0.035 | 0.05 |
| Mold Thickness | A2 | — | 0.65 | 0.67 |
| Material Thickness | A3 | — | 0.203 | — |
| Package Size | D | 5.9 | 6 | 6.1 |
| Package Size | E | 5.9 | 6 | 6.1 |
| EP Size | D1 | 4.4 | 4.5 | 4.6 |
| EP Size | E1 | 4.4 | 4.5 | 4.6 |
| Lead Length | L | 0.3 | 0.4 | 0.5 |
| Lead Pitch | e | — | 0.4 esc | — |
| Lead Width | b | 0.15 | 0.20 | 0.25 |

**Table: Package dimensions (48-pin QFN, 6×6 mm)**

### **6.2 Thermal Properties** {#thermal-properties}

| **PIN** | **Size** | **Power (W)** | **Ta (°C)** | **Theta JA (°C/W)** | **Psi JT (°C/W)** | **Theta JC (°C/W)** |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 48 QFN | 6×6 | 1 | 25 | 31.22 | 0.26 | 15.703 |

**Table 20: Thermal properties**

* **Ta**: Ambient temperature of the surrounding environment.
* **Theta JA**: Thermal resistance junction-to-ambient.
* **Psi JT**: Thermal characterization parameter between the junction and package top.
* **Theta TJ**: Junction temperature rise over case in °C/W of chip power dissipation.
* The maximum junction temperature should be controlled to less than 125°C.

### **6.3 IC Markings** {#ic-markings}

| **Line** | **Title** | **Example** | **Description** |
| :---- | :---- | :---- | :---- |
| 1 | MMXXXXMDSn | MM6108MIQ | Device number; Optional: Custom Marketing Letter; Temperature Grade; Package Type |
| 2 | TA12 YYWW | TA2103 | Fab/Assembly codes; 2 digits for Silicon revision (Major, Minor — Internal Only); date code YYWW |
| 3 | XXXXXXX | MOR946N001 | 8 digits Assy Lot number |

**Table 21: IC markings**

\* All Morse Micro ICs are lead-free.

| **Line** | **Title** | **Example** | **Description** |
| :---- | :---- | :---- | :---- |
| 1 | Major silicon revision | 0..9 | Designated by a single number from 0 to 9 |
| 2 | Minor silicon revision | 0..9 | Designated by a single number from 0 to 9 |
| M | Custom Marketing suffix | M, L | M: 56 pin package ("Medium"); L: 64 pin package ("Large") |
| D | Temperature Grade | I/C | I = -40°C to 85°C; C = 0°C to 70°C |
| S | Package Type code | Q/B | Q: QFN; B: FCBGA/BGA |
| n | Bond-Out Option | 0..9 | Designated by a single number 0..9 |

---

## **7 PCB Land Pattern** {#pcb-land-pattern}

| **Key** | **Dimension (mm)** |
| :---- | :---- |
| A | 0.90 |
| B | 0.20 |
| C | 0.40 |
| D | 5.80 |
| E | 5.80 |
| F | 4.50 |
| G | 4.50 |

---

## **8 Solder Stencil Pattern** {#solder-stencil-pattern}

| **Key** | **Dimension (mm)** |
| :---- | :---- |
| A | 0.80 |
| B | 0.15 |
| C | 0.40 |
| D | 5.80 |
| E | 5.80 |
| X | 2.00 |
| Y | 2.00 |
| Z | 0.50 |

---

## **9 Recommended Soldering Profile** {#recommended-soldering-profile}

Pb-free (SAC Alloys) Process — Classification Temperature (TC):

| **Package Thickness** | **< 350 mm³** | **350–2000 mm³** | **> 2000 mm³** |
| :---- | :---- | :---- | :---- |
| < 1.6 mm | 260 °C | 260 °C | 260 °C |
| 1.6 mm – 2.5 mm | 260 °C | 250 °C | 245 °C |
| > 2.5 mm | 250 °C | 245 °C | 245 °C |

**Table 22: Soldering profile**

| **Profile Feature** | **Pb-free Assembly** |
| :---- | :---- |
| Temperature Min (Tsmin) | 150 °C |
| Temperature Max (Tsmax) | 200 °C |
| Time (ts) from Tsmin to Tsmax | 60–120 seconds |
| Ramp-up rate (TL to TP) | 3 °C/second max |
| Liquidus temperature (TL) | 217 °C |
| Time (tL) maintained above TL | 60–150 seconds |
| Peak package body temperature (TP) | See classification temperature table |
| Time (tP) within 5 °C of TC | 30 seconds |
| Ramp-down rate (TP to TL) | 6 °C/second max |
| Time 25 °C to peak temperature | 8 minutes max |

---

## **10 Packaging and Labeling** {#packaging-and-labeling}

### **10.1 Tape & Reel Specification**

| **Term** | **Definition** |
| :---- | :---- |
| Product | MM6108 |
| # Units | 3,000 |
| Reel Size | 13 inches |
| Pizza Box | Yes |
| Vacuum Seal | Yes |
| Dry Bake | 125°C / 24 hours (MSL3) |
| Pin 1 indicator | Marked on the chip |

**Table 23: Tape and reel specifications**

### **10.2 Tray Specification**

| **Term** | **Definition** |
| :---- | :---- |
| Product | MM6108 |
| # Units | 490 |
| Tray Size | 322.6 mm × 135.9 mm |
| Pizza Box | No |
| Vacuum Seal | Yes |
| Dry Bake | 125°C / 24 hours (MSL3) |
| Pin 1 indicator | Marked on the chip |

**Table 24: Tray specifications**

---

## **11 Handling and Storage** {#handling-and-storage}

The MM6108IQ IC is a moisture-sensitive device rated at Moisture Sensitive Level 3 (MSL3) per IPC/JEDEC J-STD-20.

After opening the moisture-sealed storage bag, modules that will be subjected to reflow solder or other high-temperature processes must be:

1. Mounted to a circuit board within 168 hours at factory conditions (≤30°C and <60% RH), **OR**
2. Continuously stored per IPC/JEDEC J-STD-033.

| WARNING ICs exposed to moisture and environmental conditions exceeding packaging and storage conditions MUST be baked before mounting according to IPC/JEDEC J-STD-033. Failure to meet packaging and storage conditions will result in irreparable damage to modules during solder reflow. |
| :---- |

---

## **12 Part Number and Ordering Information** {#part-number-and-ordering-information}

| **Part Number** | **Packing Type** | **MOQ** | **Package** | **Description** | **Operating Ambient Temperature** |
| :---- | :---- | :---- | :---- | :---- | :---- |
| MM6108IQ-T | Tray | 490 | QFN 6×6 | IEEE 802.11ah Sub-1 GHz 1/2/4/8 MHz Wi-Fi HaLow SoC | -40°C to 85°C |
| MM6108IQ-TR | Tape & Reel | 3000 | QFN 6×6 | IEEE 802.11ah Sub-1 GHz 1/2/4/8 MHz Wi-Fi HaLow SoC | -40°C to 85°C |

**Table 25: Part number and ordering information**

---

## **13 Revision History** {#revision-history}

| **Release Number** | **Release Date** | **Release Notes** |
| :---- | :---- | :---- |
| DS104 | 17 Jun 2025 | Updated formatting |
| DS103 | 15 Dec 2023 | Added power sequencing requirements; Added Vih, Vil, Voh, Vol specifications; Added solder profile; Added packaging; Added chip markings; Added sleep/wake pin sequencing |
| DS102 | 8 Apr 2022 | Updated table 5.5.1 RF Spectrum Range; Added PCB land pattern and solder stencil; Updated electrical characteristics; Added Max/Min values |
| DS101 | 4 Nov 2021 | Updated recommended operating conditions; Updated Tx and Rx power consumption; Updated Adjacent Current Rejection |
| DS100 | 1 Jun 2021 | Initial release |

**Table 26: Revision history**

---

*Morse Micro Pty. Ltd. Corporate Headquarters*
*Level 8, 10-14 Waterloo Street, Surry Hills, NSW 2010, Australia*
*Email: sales@morsemicro.com*
*Copyright © Morse Micro Pty. Ltd.*
