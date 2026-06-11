---
title: 'Application Note 38: Wi-Fi EasyConnect HaLowLink Guide'
---

# Application Note 38: Wi-Fi EasyConnect HaLowLink Guide

Almost every IoT ‘thing’ necessarily lacks the input devices and sophisticated UIs we’re accustomed to working with when we enter Wi-Fi credentials into a computer or a network infrastructure device. So how can we provision IoT devices? And how can we make the process reliable and secure?

Step forward [Wi-Fi Easy Connect](https://www.wi-fi.org/beacon/dan-harkins/wi-fi-easy-connect-simple-and-secure-onboarding-for-iot), a technique developed to simplify and harden the process of loading Wi-Fi credentials onto UI-less devices. It supports a wide variety of credential delivery mechanisms, including near-field communications (NFC), Bluetooth, QR code scanning, and trusted credential servers on the networks.

To implement Wi-Fi Easy Connect, you choose the method that best suits the environment into which your device will be deployed. If the network’s Access Points have cameras, for example, you might print your device’s unique registration data as a QR code on the device or its packaging—an AP can scan the code before the device is powered up. If your device incorporates Bluetooth, you might instead add a button to trigger the transmission of the registration data to the AP.

#### **How Wi-Fi Easy Connect works: the Device Provisioning Protocol**

Wi-Fi Easy Connect is based on a section of the Wi-Fi standard called the ‘Device Provisioning Protocol’ (DPP). To allow you to see how DPP works in practice, this Application Note walks you through setting up [a pair of Morse Micro HaLowLink units](https://www.morsemicro.com/halowlink/). One operates a network-hosted DPP server, called a ‘DPP Configurator’, which is the provider of the credentials. The other behaves as if it were an unprovisioned IoT device (the ‘DPP Enrollee’) just brought to the network and requesting access credentials.

DPP is a request-response mechanism. The DPP Enrollee requests credentials by issuing a DPP Uniform Resource Identifier (DPP URI), which encodes identification information, such as a MAC address, and the device’s PKI (Public Key Infrastructure) public key to ensure only it is able to decrypt the credentials received from the DPP Configurator. The DPP URI is typically transmitted by one of the mechanisms listed above.

| INFO For the demo, you’ll be using manual transfer initiated at the command line within each HaLowLink's web UI. In fact, all of the process of configuration and credential exchange is managed via the command line. Though this is a good way to observe DPP in operation, it’s not ideal for real products that don’t or can’t offer a suitable UI for key generation, DPP URI entry and service enablement. Usually, the DPP URI is pre-generated and transmitted as a QR code or via wireless. |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

The use of Public Key Infrastructure (PKI) encryption means that credential exchange is entirely secure. DPP exchange uses [Wi-Fi action frames](https://en.wikipedia.org/wiki/802.11_frame_types#Action_frames) so it doesn't rely on any form of pre-association or the presence of a temporary and insecure WLAN for credential exchange. Generally speaking, there's no need for a user interface, so provisioning via DPP can be performed reliably by anyone, irrespective of their technical ability.

#### **The demo process**

What does the DPP demo involve? This is the process we’ll follow:

1. The HaLowLink standing in for the IoT device is reconfigured as a wireless Extender so that it behaves as a client.
2. The Extender's private and public keys are generated and stored.
3. The public key is used to construct the Extender's DPP URI.
4. The Extender is set to emit DPP Presence Announcement (PA) packets to signal to a DPP Configurator that it needs local network credentials.
5. The second HaLowLink, operating in the usual Access Point mode, enables its DPP Configurator service, which is configured with the network SSID and passphrase, and the client's DPP URI.
6. The Access Point starts listening for DPP PAs.
7. On receipt of the Extender's DPP PA—or one from any other registered client device, for that matter—the DPP Configurator matches the PA with the URI it holds to verify the client.
8. The DPP Configurator uses the client's public key to encrypt the Wi-Fi credentials, which it then transmits to the client.
9. The Extender uses its private key to decrypt the credentials, applies them and connects to the network.

DPP exchange is now complete. Provided that the network owner makes no changes to the SSID or the passphrase, if the client is ever powered down, it will reconnect automatically when it starts up again.

#### **Requirements**

To perform the steps listed in this Application Note, you will need:

* Two Morse Micro HaLowLink devices with the latest software installed (this guide was written using version 2.7.4).
* A laptop with two USB-C ports (or USB-A to USB-C adapters).

###

### **Configure the HaLowLink Extender**

#### **1. Switch the HaLowLink to Extender mode**

By default, the HaLowLink is configured as a router and access point. To switch the device to Extender mode, so that it operates as a client device:

1. Connect your laptop to the HaLowLink using a USB-C cable.
2. Wait until the HaLowLink’s **Status** LED is **solid green** or **solid aqua**.
3. Wait until the **Status** LED is **solid aqua**.

Because the HaLowLink is now in Extender mode, its DHCP server is not enabled. Use the unit’s static emergency recovery IP address, `10.22.121.111`, to access it. To do so, first configure your laptop’s Ethernet connection to use the static IP address `10.22.121.110` and the subnet mask `255.255.255.0`.

#### **2. Access the HaLowLink terminal**

To configure the Extender and set up DPP, you first need to open the terminal built into the HaLowLink:

1. Open a web browser on your laptop and go to `http://10.22.121.111`.
2. Click **Advanced** in the HaLowLink web interface’s left-side menu.
3. Select **Services** and then **Terminal**.
4. Log into the terminal with the same password you used in Step 2.

#### **3. Generate a public-private key pair**

In the HaLowLink terminal, generate a key pair using the `openssl` command line tool:

`openssl ecparam -genkey -name prime256v1 -noout -outform PEM > /etc/dpp_key.pem`

| INFO `/etc/dpp_key.pem` is the default key path as specified by the `dpp_key` variable in the HaLowLink’s `wpa_supplicant` configuration file. We suggest you don’t change this. It is also possible to configure `wpa_supplicant` to generate a key at runtime, but this is outside of the scope of this Application Note. |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

#### **4. Begin to transmit credential requests** <a href="#id-4.-begin-to-transmit-credential-requests" id="id-4.-begin-to-transmit-credential-requests"></a>

To emit DPP Presence Announcements which, when detected, inform the DPP Configurator to return the Wi-Fi credentials to the Extender, run these three commands:

`uci set wireless.default_radio1.dpp=1`\
`uci commit`\
`reload_config`

| INFO The first command assumes you are working with `radio1`. You can confirm that `radio1` is in use with the command `uci show wireless.radio1.type`, which will output `wireless.radio1.type='morse'` if `radio1` is the radio in use. If it is not, substitute `radio0` for `radio1` in each command. |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

#### **5. Get the Extender’s DPP URI** <a href="#id-5.-get-the-extenders-dpp-uri" id="id-5.-get-the-extenders-dpp-uri"></a>

Use the following command to generate and display the Extender’s DPP URI:

`wpa_cli_s1g dpp_bootstrap_get_uri 1 ; echo`

This will output lines like these:

`Selected interface 'wlan0'`\
`DPP:M:94bb43dcf993;V:3;K:MDkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDIgADpfVUMGW64skm+qzbmcn1nw3cgZw+fA2oJgEYSI06oAk=;;`

Select and copy the line beginning `DPP:`. You can keep it on the clipboard, or paste it into a text file on your laptop until it’s needed. You will provide it to the DPP Configurator in a later step.

#### **6. Confirm that DPP transmission is working**

Observe the logs to confirm that DPP transmission (`DPP-TX`) is taking place:

`logread -f`

This will generate output like:

`wlan0: DPP-TX dst=ff:ff:ff:ff:ff:ff freq=5745 type=13`\
`wlan0: DPP-TX dst=ff:ff:ff:ff:ff:ff freq=5805 type=13`\
`wlan0: DPP-TX dst=ff:ff:ff:ff:ff:ff freq=5865 type=13`\
`wlan0: DPP-TX dst=ff:ff:ff:ff:ff:ff freq=5745 type=13`\
`wlan0: DPP-TX dst=ff:ff:ff:ff:ff:ff freq=5805 type=13`\
`wlan0: DPP-TX dst=ff:ff:ff:ff:ff:ff freq=5865 type=13`

| INFO We suggest leaving the Extender’s terminal open while you configure the Access Point. |
| ------------------------------------------------------------------------------------------ |

### **Configure the HaLowLink Access Point**

#### **1. Reset the HaLowLink (Optional)**

By default, every HaLowLink is configured as a router and access point, so the Access Point unit needs no special setup. However, if you have previously modified its configuration, we suggest performing a factory reset before continuing:

1. Connect your laptop to the HaLowLink via USB-C.

| WARNING Do not disconnect the Extender from your laptop. You should have two HaLowLinks connected to your laptop. |
| ----------------------------------------------------------------------------------------------------------------- |

2. Wait until the Access Point HaLowLink’s **Status** LED is **solid green** or **solid aqua**.
3. Wait until the Access Point HaLowLink’s **Status** LED is **solid green**.

#### **2. Open the Access Point’s terminal**

1. In your laptop’s web browser, go to `http://192.168.12.1`.
2. Log in using the username and password printed on the Access Point HaLowLink’s information label.
3. Click **Advanced** in the HaLowLink web interface’s left-side menu.
4. Log into the terminal with the same password you used in Step 2.

#### **3. Get the current Wi-Fi credentials**

First confirm which radio is in use by entering the following command:

`uci show wireless.radio1.type`

This should respond with `wireless.radio1.type='morse'`. If the output is different, substitute `radio0` for `radio1` and try again.

Now get the Access Point’s network SSID as a hexadecimal numeric value:

`uci get wireless.default_radio1.ssid | tr -d '\n' | hexdump -v -e '/"%02x"' ; echo`

This will output the SSID. For example:

`68616c6f776c696e6b312d66346131`

Now get the network passphrase as a hexadecimal value:

`uci get wireless.default_radio1.key | tr -d '\n' | hexdump -v -e '/"%02x"' ; echo`

This will output something like:

`6c617a7930387465`

These hexadecimal values will be used in the next step.

#### **4. Configure the Configurator and register the DPP URI** <a href="#id-4.-configure-the-configurator-and-register-the-dpp-uri" id="id-4.-configure-the-configurator-and-register-the-dpp-uri"></a>

Run the command `hostapd_cli_s1g`. It will report that the selected interface is `wlan0`. At its `>` prompt enter the following command:

`dpp_configurator_add`

Now enter the following command, substituting `<ssid>` and `<pass>` for the SSID and passphrase values you acquired in the previous step:

`dpp_configurator_sign conf=ap-sae configurator=1 ssid=<ssid> pass=<pass>`

The tool should respond with `DPP-CONF-RECEIVED ... OK`.

To register the Extender’s DPP URI, run the following command, substituting `<dpp_uri>` for the string prefixed `DPP:` that you copied in [Step 5 of the Extender setup flow](./#5.-get-the-extender’s-dpp-uri), above:

`dpp_qr_code <dpp_uri>`

You can now exit from `hostapd_cli_s1g` by entering `quit`.

#### **5. Verify that your Extender was correctly provisioned**

View the logs:

`logread -f`

Look for the following lines, which indicate that the Extender’s DPP Presence Announcements have been received, that the Extender has been successfully authorized, and that the network credentials have been sent via DPP back to the Extender:

`wlan0: DPP-TX dst=ff:ff:ff:ff:ff:ff freq=5805 type=13`\
`wlan0: DPP-TX dst=ff:ff:ff:ff:ff:ff freq=5865 type=13`\
`wlan0: DPP-TX dst=ff:ff:ff:ff:ff:ff freq=5745 type=13`\
`wlan0: DPP-TX dst=ff:ff:ff:ff:ff:ff freq=5805 type=13`\
`wlan0: DPP-RX src=0c:bf:74:00:07:a1 freq=5805 type=0`\
`wlan0: DPP-CHIRP-STOPPED`\
`wlan0: DPP-TX dst=0c:bf:74:00:07:a1 freq=5805 type=1`\
`wlan0: DPP-TX-STATUS dst=0c:bf:74:00:07:a1 freq=5805 result=SUCCESS`\
`wlan0: DPP-RX src=0c:bf:74:00:07:a1 freq=5805 type=2`\
`wlan0: DPP-AUTH-SUCCESS init=0 pkhash=... own=1 peer=-1`\
`wlan0: GAS-QUERY-START addr=0c:bf:74:00:07:a1 dialog_token=214 freq=5805`\
`wlan0: GAS-QUERY-DONE addr=0c:bf:74:00:07:a1 dialog_token=214 freq=5805 status_code=0 result=SUCCESS`\
`wlan0: DPP-CONF-RECEIVED`\
`wlan0: DPP-CONFOBJ-AKM sae`\
`wlan0: DPP-CONFOBJ-SSID halowlink1-f4a1`\
`...`\
`wlan0: DPP-PB-RESULT success`

### **Verify the Setup**

After following the steps above, the **Wi-Fi HaLow** purple LED on the Extender should come on. You can verify that it’s connected to your Access Point by going to the Access Point’s web interface at `http://192.168.12.1` and clicking on the **Access Point** card to view a list of its associated devices:

You can also go back to the Extender’s user interface at `http://10.22.121.111` and click on the **Uplink** card to confirm that it now holds the correct credentials.

Once the credentials have been transferred and stored, DPP is no longer needed. You will be able to power-down the devices and set them up elsewhere. Once both units are powered again, the Extender will automatically re-connect to the network.

###

### **FAQs**

**What happens if I change the SSID and/or password on an AP after provisioning devices?**\
Enrolled devices will lose access. With the mechanism described, once an IoT device has received Wi-Fi credentials, it ceases to transmit any further requests for those credentials. Additionally, the DPP Configurator does not retain DPP URIs once they have been claimed. To reconnect a device, you will need to re-enable DPP Presence Announcements (as in [Step 4 of the Extender setup flow](./#4.-begin-to-transmit-credential-requests), above) and resubmit its DPP URI to the DPP Configurator (see [Step 4 of the Access Point setup flow](./#4.-configure-the-configurator-and-register-the-dpp-uri), above).

**Can I use DPP URIs with HaLowLinks out of the box?**\
No. This Application Note describes how to experiment with DPP URIs and is intended for customers considering their use in a product. It includes operations that are not performed by default and services not enabled out of the box, specifically:

* HaLowLinks are not automatically provisioned with a DPP private-public key pair.
* HaLowLinks do not have a DPP URI generated automatically.

| INFO The QR code printed on each HaLowLink contains only the Wi-Fi credentials. It does not contain a DPP URI. |
| -------------------------------------------------------------------------------------------------------------- |

* There is no user-friendly mechanism to generate an Extender’s DPP URI and transfer it to an Access Point.
* When a HaLowLink is switched to Extender mode, it does not automatically emit DPP Presence Announcements.

**How would I use DPP URIs in a product?**\
One approach would be to use the interaction described in this document and mitigate the deficiencies discussed above. However, you may also consider:

* Using a custom DPP Configurator, such as a mobile app, which can configure both Access Points and Clients, i.e., read client DPP URIs from DPP Enrollees and transmit them to the Access Point.
* Providing the DPP URI of devices via some other mechanism. For instance, a trusted service could be pre-populated with DPP URIs which are generated on the assembly line. See [section 5 of the Wi-Fi EasyConnect Specification 3.0](https://www.wi-fi.org/system/files/members/Wi-Fi_Easy_Connect_Specification_v3.0.pdf) for a discussion of possible approaches.

**How can an Access Point ever read a QR code if it doesn’t have a camera?**\
It can’t, but a mobile app can and then transmit the code’s contents to the Access Point.

### **Further information**

For more information on Wi-Fi Easy Connect, please see:

* [Wi-Fi Easy Connect™: Simple and secure onboarding for IoT](https://www.wi-fi.org/beacon/dan-harkins/wi-fi-easy-connect-simple-and-secure-onboarding-for-iot)
* [Wi-Fi Easy Connect](https://www.wi-fi.org/discover-wi-fi/wi-fi-easy-connect)
* [Wi-Fi Easy Connect Specification 3.0](https://www.wi-fi.org/system/files/members/Wi-Fi_Easy_Connect_Specification_v3.0.pdf)

For technical details about `hostapd`’s DPP implementation, please refer to the [`DPP Read Me file`](https://github.com/MorseMicro/hostap/blob/415d1757c25357e0d5423fe5f025e4384be7cb1b/wpa_supplicant/README-DPP) in our `wpa_supplicant` code repository.
