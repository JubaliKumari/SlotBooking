import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Printer,
  Style,
  Align,
  InMemory,
} from '@linvix-sistemas/react-native-escpos-buffer';
import { useBluetoothPrinter } from '../../../../utils/BluetoothService';

export const PaymentReceiptModal = ({ visible, onClose, paymentDtls }) => {
  // Local modal state
  const [showPrinterModal, setShowPrinterModal] = useState(false);

  // Use Bluetooth printer hook
  const {
    bluetoothDevices,
    pairedDevices,
    scanning,
    connecting,
    connectedDevice,
    printing,
    scanForDevices,
    connectToPrinter: connectToDevice,
    printBuffer,
  } = useBluetoothPrinter();

  // Handle scanning for devices
  const handleScanForDevices = () => {
    scanForDevices(() => {
      // This callback is called when scanning completes
      setShowPrinterModal(true);
    });
  };

  // Wrapper for connecting to printer and closing modal
  const handleConnectToPrinter = async device => {
    const success = await connectToDevice(device);
    if (success) {
      setShowPrinterModal(false);
    }
  };

  // Format and print receipt
  const printReceipt = async () => {
    if (!connectedDevice) {
      Alert.alert('No Printer', 'Please connect to a Bluetooth printer first.');
      handleScanForDevices();
      return;
    }

    try {
      // Create ESC/POS buffer
      const connection = new InMemory();
      const printer = await Printer.CONNECT('TM-T20', connection);

      // Build receipt content
      await printer.feed(1);

      // Header
      await printer.writeln(
        '================================',
        Style.Normal,
        Align.Center,
      );
      await printer.writeln('PAYMENT RECEIPT', Style.Bold, Align.Center);
      await printer.writeln(
        '================================',
        Style.Normal,
        Align.Center,
      );
      await printer.writeln(
        paymentDtls?.ulbDtl?.ulbName || 'Municipal Corporation',
        Style.Normal,
        Align.Center,
      );
      await printer.writeln(
        '================================',
        Style.Normal,
        Align.Center,
      );
      await printer.feed(1);

      // Title
      await printer.writeln(
        paymentDtls?.description || 'HOLDING TAX RECEIPT',
        Style.Bold,
        Align.Center,
      );
      await printer.feed(1);

      // Receipt details
      await printer.writeln(
        `Receipt No: ${paymentDtls?.tranNo || 'N/A'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Date: ${paymentDtls?.tranDate || 'N/A'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Department: ${paymentDtls?.department || 'N/A'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Ward No: ${paymentDtls?.wardNo || 'N/A'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `New Ward No: ${paymentDtls?.newWardNo || 'N/A'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `SAF No: ${paymentDtls?.safNo || 'N/A'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Received From: ${paymentDtls?.ownerName || 'N/A'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Address: ${paymentDtls?.address || 'N/A'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Amount: Rs. ${paymentDtls?.amount || '0.00'}`,
        Style.Bold,
        Align.Left,
      );
      await printer.writeln(
        `In Words: ${paymentDtls?.amountInWords || ''}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Towards: ${paymentDtls?.accountDescription || ''}`,
        Style.Normal,
        Align.Left,
      );
      await printer.writeln(
        `Via: ${paymentDtls?.paymentMode || 'Cash'}`,
        Style.Normal,
        Align.Left,
      );
      await printer.feed(1);

      // Table
      await printer.writeln(
        '================================',
        Style.Normal,
        Align.Center,
      );
      await printer.writeln(
        'Description          Amount',
        Style.Bold,
        Align.Center,
      );
      await printer.writeln(
        '================================',
        Style.Normal,
        Align.Center,
      );

      // Holding Tax
      const holdingDesc = 'Holding Tax'.substring(0, 18);
      const holdingAmt = `Rs. ${paymentDtls?.holdingTax || '0'}`;
      await printer.writeln(
        `${holdingDesc.padEnd(20)} ${holdingAmt}`,
        Style.Normal,
        Align.Left,
      );

      // RWH Tax
      const rwhDesc = 'RWH Tax'.substring(0, 18);
      const rwhAmt = `Rs. ${paymentDtls?.rwhTax || '0'}`;
      await printer.writeln(
        `${rwhDesc.padEnd(20)} ${rwhAmt}`,
        Style.Normal,
        Align.Left,
      );

      // Fine/Rebate
      for (const fine of paymentDtls?.fineRebate || []) {
        const desc = (fine?.headName || '').substring(0, 18);
        const amt = `Rs. ${fine?.amount}`;
        await printer.writeln(
          `${desc.padEnd(20)} ${amt}`,
          Style.Normal,
          Align.Left,
        );
      }

      await printer.writeln(
        '================================',
        Style.Normal,
        Align.Center,
      );
      await printer.writeln(
        `Total: Rs. ${paymentDtls?.amount || '0.00'}`,
        Style.Bold,
        Align.Right,
      );
      await printer.writeln(
        '================================',
        Style.Normal,
        Align.Center,
      );
      await printer.feed(1);

      // Footer
      await printer.writeln(
        '** This is a computer-generated',
        Style.Normal,
        Align.Center,
      );
      await printer.writeln(
        'receipt and does not require',
        Style.Normal,
        Align.Center,
      );
      await printer.writeln('signature. **', Style.Normal, Align.Center);

      // Cut paper and feed
      await printer.cutter();
      await printer.feed(3);

      // Get buffer and print using Bluetooth service
      const buffer = connection.buffer();
      await printBuffer(buffer, {
        successMessage: 'Receipt printed successfully!',
        errorMessage: 'Failed to print receipt. Please try again.',
      });
    } catch (error) {
      console.error('Print error:', error);
      Alert.alert(
        'Print Failed',
        'Failed to format receipt. Please try again.',
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ScrollView style={styles.modalContainer}>
        {/* Header */}
        <Text style={styles.header}>View Receipt</Text>

        {/* Logo */}
        <View style={styles.logoWrapper}>
          <Text style={styles.logoCircle}>🏛️</Text>
        </View>

        {/* Corporation Name */}
        <Text style={styles.corpName}>
          {paymentDtls?.ulbDtl?.ulbName || 'Ranchi Municipal Corporation'}
        </Text>

        {/* Subheading */}
        <Text style={styles.receiptType}>
          {paymentDtls?.description || 'HOLDING TAX RECEIPT'}
        </Text>

        {/* Horizontal line */}
        <View style={styles.divider} />

        {/* Meta Info Section */}
        <View style={styles.metaRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labelFixed}>
              Receipt No.:{' '}
              <Text style={styles.bold}>{paymentDtls?.tranNo}</Text>
            </Text>
            <Text style={styles.labelFixed}>
              Department:{' '}
              <Text style={styles.bold}>{paymentDtls?.department}</Text>
            </Text>
            <Text style={styles.labelFixed}>
              Account:{' '}
              <Text style={styles.bold}>{paymentDtls?.accountDescription}</Text>
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.labelFixed}>
              Date: <Text style={styles.bold}>{paymentDtls?.tranDate}</Text>
            </Text>
            <Text style={styles.labelFixed}>
              Ward No: <Text style={styles.bold}>{paymentDtls?.wardNo}</Text>
            </Text>
            <Text style={styles.labelFixed}>
              New Ward No:{' '}
              <Text style={styles.bold}>{paymentDtls?.newWardNo}</Text>
            </Text>
            <Text style={styles.labelFixed}>
              SAF No: <Text style={styles.bold}>{paymentDtls?.safNo}</Text>
            </Text>
          </View>
        </View>

        {/* Owner Info */}
        <View style={{ marginTop: 10 }}>
          <Text style={styles.labelFixed}>
            Received From:{' '}
            <Text style={styles.bold}>{paymentDtls?.ownerName}</Text>
          </Text>
          <Text style={styles.labelFixed}>
            Address: <Text style={styles.bold}>{paymentDtls?.address}</Text>
          </Text>
          <Text style={styles.labelFixed}>
            A Sum of Rs.: <Text style={styles.bold}>{paymentDtls?.amount}</Text>
          </Text>
          <Text style={styles.labelFixed}>
            (In words):{' '}
            <Text style={styles.bold}>{paymentDtls?.amountInWords}</Text>
          </Text>
          <Text style={styles.labelFixed}>
            Towards:{' '}
            <Text style={styles.bold}>{paymentDtls?.accountDescription}</Text>{' '}
            Vide: <Text style={styles.bold}>{paymentDtls?.paymentMode}</Text>
          </Text>
        </View>

        {/* Tax Table */}
        <View style={styles.tableWrapper}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.col, { flex: 2 }]}>Description</Text>
            <Text style={styles.col}>From QTR</Text>
            <Text style={styles.col}>From FY</Text>
            <Text style={styles.col}>To QTR</Text>
            <Text style={styles.col}>To FY</Text>
            <Text style={[styles.col, { flex: 1 }]}>Amount</Text>
          </View>

          {/* Holding Tax */}
          <View style={styles.tableRowModal}>
            <Text style={[styles.col, { flex: 2 }]}>Holding Tax</Text>
            <Text style={styles.col}>{paymentDtls?.fromQtr}</Text>
            <Text style={styles.col}>{paymentDtls?.fromFyear}</Text>
            <Text style={styles.col}>{paymentDtls?.uptoQtr}</Text>
            <Text style={styles.col}>{paymentDtls?.uptoFyear}</Text>
            <Text style={[styles.col, { flex: 1 }]}>
              {paymentDtls?.holdingTax}
            </Text>
          </View>

          {/* RWH */}
          <View style={styles.tableRowModal}>
            <Text style={[styles.col, { flex: 2 }]}>RWH</Text>
            <Text style={styles.col}>{paymentDtls?.fromQtr}</Text>
            <Text style={styles.col}>{paymentDtls?.fromFyear}</Text>
            <Text style={styles.col}>{paymentDtls?.uptoQtr}</Text>
            <Text style={styles.col}>{paymentDtls?.uptoFyear}</Text>
            <Text style={[styles.col, { flex: 1 }]}>{paymentDtls?.rwhTax}</Text>
          </View>

          {/* JSK Rebate (if exists) */}
          {paymentDtls?.fineRebate?.length > 0 &&
            paymentDtls.fineRebate.map((item, index) => (
              <View key={index} style={styles.tableRowModal}>
                <Text style={[styles.col, { flex: 2 }]}>{item.headName}</Text>
                <Text style={styles.col}>-</Text>
                <Text style={styles.col}>-</Text>
                <Text style={styles.col}>-</Text>
                <Text style={styles.col}>-</Text>
                <Text style={[styles.col, { flex: 1 }]}>{item.amount}</Text>
              </View>
            ))}

          {/* Totals */}
          <View style={styles.tableRowModal}>
            <Text style={[styles.col, { flex: 5, fontWeight: 'bold' }]}>
              Total Amount
            </Text>
            <Text style={[styles.col, { flex: 1 }]}>{paymentDtls?.amount}</Text>
          </View>
          <View style={styles.tableRowModal}>
            <Text style={[styles.col, { flex: 5, fontWeight: 'bold' }]}>
              Total Paid Amount
            </Text>
            <Text style={[styles.col, { flex: 1 }]}>{paymentDtls?.amount}</Text>
          </View>
        </View>

        {/* Footer with QR & Contact */}
        <View style={styles.footerRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.qrBox} />
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.footerText}>Visit:</Text>
            <Text style={styles.footerText}>Call: 8002158818</Text>
            <Text style={styles.footerText}>In collaboration with</Text>
            <Text style={styles.footerText}>Uinfo Technology PVT LTD.</Text>
          </View>
        </View>

        <Text style={styles.generatedNote}>
          ** This is a computer-generated receipt and does not require
          signature. **
        </Text>

        {/* Print Buttons */}
        <View style={styles.buttonContainer}>
          {connectedDevice && (
            <Text style={styles.connectedText}>
              Connected: {connectedDevice.name}
            </Text>
          )}
          <TouchableOpacity
            style={styles.printBtn}
            onPress={printReceipt}
            disabled={printing}
          >
            {printing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.printText}>
                {connectedDevice ? 'Print Receipt' : 'Connect & Print'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.scanBtn}
            onPress={handleScanForDevices}
            disabled={scanning}
          >
            {scanning ? (
              <ActivityIndicator color="#1E40AF" />
            ) : (
              <Text style={styles.scanText}>
                {connectedDevice ? 'Change Printer' : 'Scan for Printers'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Printer Selection Modal */}
      <Modal
        visible={showPrinterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrinterModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.printerModalContent}>
            <View style={styles.printerModalHeader}>
              <Text style={styles.printerModalTitle}>
                Select Bluetooth Printer
              </Text>
              <TouchableOpacity
                onPress={() => setShowPrinterModal(false)}
                style={styles.closeIconBtn}
              >
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.printerList}>
              {/* Paired Devices */}
              {pairedDevices && (
                <>
                  <Text style={styles.sectionTitle}>Paired Devices</Text>
                  {pairedDevices.map((device, index) => (
                    <TouchableOpacity
                      key={`paired-${index}`}
                      style={[
                        styles.deviceItem,
                        connectedDevice?.address === device.address &&
                          styles.connectedDevice,
                      ]}
                      onPress={() => handleConnectToPrinter(device)}
                      disabled={connecting}
                    >
                      <View>
                        <Text style={styles.deviceName}>
                          {device.name || 'Unknown Device'}
                        </Text>
                        <Text style={styles.deviceAddress}>
                          {device.address || device.id}
                        </Text>
                      </View>
                      {connecting ? (
                        <ActivityIndicator size="small" color="#1E40AF" />
                      ) : connectedDevice?.address === device.address ? (
                        <Text style={styles.connectedTag}>Connected</Text>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {/* Scanned Devices */}
              {bluetoothDevices.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Available Devices</Text>
                  {bluetoothDevices.map((device, index) => (
                    <TouchableOpacity
                      key={`scanned-${index}`}
                      style={styles.deviceItem}
                      onPress={() => handleConnectToPrinter(device)}
                      disabled={connecting}
                    >
                      <View>
                        <Text style={styles.deviceName}>
                          {device.name || 'Unknown Device'}
                        </Text>
                        <Text style={styles.deviceAddress}>
                          {device.address || device.id}
                        </Text>
                      </View>
                      {connecting && (
                        <ActivityIndicator size="small" color="#1E40AF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </>
              )}

              {pairedDevices.length === 0 && bluetoothDevices.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    No Bluetooth devices found.
                  </Text>
                  <Text style={styles.emptySubtext}>
                    Make sure your printer is turned on and paired.
                  </Text>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.rescanBtn}
              onPress={handleScanForDevices}
              disabled={scanning}
            >
              {scanning ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.rescanText}>Rescan Devices</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d2a7e',
    marginBottom: 10,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoCircle: {
    fontSize: 30,
  },
  corpName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  receiptType: {
    alignSelf: 'center',
    marginVertical: 5,
    borderWidth: 1,
    paddingHorizontal: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelFixed: {
    fontSize: 13,
    marginVertical: 2,
    fontWeight: '600',
    color: '#555',
  },
  bold: {
    fontWeight: 'bold',
  },
  tableWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 15,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 6,
  },
  tableRowModal: {
    flexDirection: 'row',
    padding: 6,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  col: {
    flex: 1,
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  qrBox: {
    width: 90,
    height: 90,
    backgroundColor: '#ccc',
    alignSelf: 'center',
  },
  footerText: {
    fontSize: 13,
    marginBottom: 2,
  },
  generatedNote: {
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 15,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    marginBottom: 45,
    backgroundColor: 'blue',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 16,
  },
  connectedText: {
    fontSize: 13,
    color: '#16a34a',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  printBtn: {
    backgroundColor: '#1E40AF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  printText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scanBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E40AF',
  },
  scanText: {
    color: '#1E40AF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Printer Modal Styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  printerModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
  },
  printerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  printerModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  closeIconBtn: {
    padding: 4,
  },
  closeText: {
    color: '#b30000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  printerList: {
    maxHeight: 400,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginTop: 8,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  connectedDevice: {
    backgroundColor: '#dbeafe',
    borderColor: '#1E40AF',
    borderWidth: 2,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  deviceAddress: {
    fontSize: 12,
    color: '#6b7280',
  },
  connectedTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
  },
  rescanBtn: {
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  rescanText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
