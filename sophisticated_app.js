// filename: sophisticated_app.js

/**
 * Sophisticated App
 * 
 * This is a creative and complex code example written in JavaScript to demonstrate
 * the implementation of a sophisticated application with multiple features.
 * 
 * The purpose of this app is to simulate an online store with various functionalities
 * such as product listing, cart management, order placement, and more.
 * 
 * Author: John Doe
 * Version: 1.0
 */

// Various import statements for external libraries or modules
import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { Table, Modal, Button, Form, Input, Notification } from 'antd';

// Class definition for the online store application
class OnlineStoreApp extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      products: [],
      cart: [],
      selectedProduct: null,
      showModal: false,
      orderPlaced: false
    };
  }
  
  componentDidMount() {
    this.fetchProductList();
  }
  
  fetchProductList = () => {
    axios.get('/api/products')
      .then((response) => {
        this.setState({ products: response.data });
      })
      .catch((error) => {
        console.error('Error fetching product list:', error);
      });
  }
  
  addToCart = (product) => {
    const { cart } = this.state;
    const newCartItem = {
      id: uuidv4(),
      name: product.name,
      price: product.price,
      quantity: 1
    };
    
    const existingCartItem = cart.find((item) => item.name === product.name);
    
    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      cart.push(newCartItem);
    }
    
    this.setState({ cart });
    
    Notification.success({
      message: 'Added to Cart',
      description: `${product.name} added to the cart successfully.`
    });
  };
  
  removeFromCart = (itemId) => {
    const { cart } = this.state;
    const updatedCart = cart.filter((item) => item.id !== itemId);
    
    this.setState({ cart: updatedCart });
    
    Notification.warning({
      message: 'Removed from Cart',
      description: 'Item removed from the cart successfully.'
    });
  };
  
  openModal = (product) => {
    this.setState({ selectedProduct: product, showModal: true });
  };
  
  closeModal = () => {
    this.setState({ selectedProduct: null, showModal: false });
  };
  
  submitOrder = (values) => {
    const { selectedProduct } = this.state;
    
    const orderData = {
      selectedProductId: selectedProduct.id,
      name: values.name,
      email: values.email,
      address: values.address,
      paymentMethod: values.paymentMethod,
      orderDate: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    
    axios.post('/api/place-order', orderData)
      .then(() => {
        this.setState({ orderPlaced: true });
        
        Modal.success({
          title: 'Order Placed',
          content: 'Your order has been placed successfully. Thank you for shopping with us!'
        });
      })
      .catch((error) => {
        console.error('Error placing order:', error);
        this.setState({ orderPlaced: false });
        
        Modal.error({
          title: 'Error',
          content: 'An error occurred while placing your order. Please try again later.'
        });
      })
      .finally(() => {
        this.closeModal();
      });
  };
  
  render() {
    const { products, cart, selectedProduct, showModal, orderPlaced } = this.state;
    
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Price', dataIndex: 'price', key: 'price' },
      { 
        title: 'Action', key: 'action',
        render: (text, record) => (
          <Button type="primary" onClick={() => this.addToCart(record)}>
            Add to Cart
          </Button>
        )
      },
    ];
    
    return (
      <div>
        <h1>Online Store</h1>
        
        <Table dataSource={products} columns={columns} />
        
        <h2>Cart</h2>
        
        <Table dataSource={cart}>
          <Table.Column title="Name" dataIndex="name" key="name" />
          <Table.Column title="Quantity" dataIndex="quantity" key="quantity" />
          <Table.Column
            title="Action"
            render={(text, record) => (
              <Button type="danger" onClick={() => this.removeFromCart(record.id)}>
                Remove
              </Button>
            )}
          />
        </Table>
        
        <Modal
          title={selectedProduct ? selectedProduct.name : ''}
          visible={showModal}
          onCancel={this.closeModal}
          footer={null}
        >
          {!orderPlaced ? (
            <Form onFinish={this.submitOrder}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter your name.' }]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email.' },
                  { type: 'email', message: 'Please enter a valid email address.' },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter your address.' }]}
              >
                <Input.TextArea rows={4} placeholder="Enter your address" />
              </Form.Item>
              <Form.Item
                name="paymentMethod"
                label="Payment Method"
                rules={[{ required: true, message: 'Please select a payment method.' }]}
              >
                <Select placeholder="Select a payment method">
                  <Select.Option value="paypal">PayPal</Select.Option>
                  <Select.Option value="creditCard">Credit Card</Select.Option>
                  <Select.Option value="bankTransfer">Bank Transfer</Select.Option>
                </Select>
              </Form.Item>
              <Button type="primary" htmlType="submit">Place Order</Button>
            </Form>
          ) : (
            <p>Your order has been successfully placed! Thank you for shopping with us!</p>
          )}
        </Modal>
      </div>
    );
  }
}

// Render the OnlineStoreApp component
ReactDOM.render(<OnlineStoreApp />, document.getElementById('root'));
