const PDFDocument = require('pdfkit');
const Order = require('../models/Order');
const User = require('../models/User');

async function generateInvoicePDF(orderId) {
  const order = await Order.findById(orderId)
    .populate('userId', 'name email')
    .populate('items.productId', 'name brand model');

  if (!order) throw new Error('Order not found');

  const doc = new PDFDocument();

  // Header
  doc.fontSize(18).text('Invoice', { align: 'center' });
  doc.moveDown();

  // Customer info
  doc.fontSize(12).text(`Customer: ${order.userId?.name || 'Guest'}`);
  doc.text(`Email: ${order.userId?.email || 'N/A'}`);
  doc.moveDown();

  // Order info
  doc.text(`Order ID: ${order._id}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.text(`Status: ${order.status}`);
  doc.text(`Payment: ${order.paymentStatus}`);
  doc.moveDown();

  // Items table
  doc.text('Items:');
  order.items.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.productId?.name || 'Unknown'} - Qty: ${item.quantity} - ₹${item.price}`
    );
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: ₹${order.totalAmount.toFixed(2)}`, {
    align: 'right'
  });

  doc.end();
  return doc;
}

module.exports = generateInvoicePDF;
