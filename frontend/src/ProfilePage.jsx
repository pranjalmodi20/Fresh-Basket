import React, { useState } from 'react';
import './ProfilePage.css';

const ProfilePage = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const mockOrders = [
    {
      id: '#ORD001',
      date: '2025-12-03',
      items: 3,
      total: 1305,
      status: 'Delivered',
    },
    {
      id: '#ORD002',
      date: '2025-12-02',
      items: 2,
      total: 850,
      status: 'Pending',
    },
    {
      id: '#ORD003',
      date: '2025-12-01',
      items: 5,
      total: 2100,
      status: 'Delivered',
    },
  ];

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = () => {
    setEditMode(false);
    // TODO: API call to update user
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'Pending':
        return 'status-pending';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return 'fas fa-check-circle';
      case 'Pending':
        return 'fas fa-clock';
      case 'Cancelled':
        return 'fas fa-times-circle';
      default:
        return '';
    }
  };

  return (
    <div className="profile-page">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar">
            <i className="fas fa-user-circle"></i>
          </div>
          <div className="profile-info">
            <h1>{user?.name || 'User'}</h1>
            <p>{user?.email || 'email@example.com'}</p>
            <p className="member-since">
              Member since{' '}
              {new Date(user?.createdAt).toLocaleDateString(
                'en-IN'
              )}
            </p>
          </div>
          {!editMode && (
            <button
              className="edit-btn"
              onClick={() => setEditMode(true)}
            >
              <i className="fas fa-edit"></i> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Edit Mode */}
      {editMode && (
        <div className="edit-profile-modal">
          <div className="edit-form">
            <h2>Edit Profile</h2>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={editData.phone}
                onChange={handleEditChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={editData.address}
                onChange={handleEditChange}
              ></textarea>
            </div>
            <div className="form-actions">
              <button
                className="btn-cancel"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${
            activeTab === 'overview' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-user"></i> Overview
        </button>
        <button
          className={`tab-btn ${
            activeTab === 'orders' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('orders')}
        >
          <i className="fas fa-box"></i> Orders
        </button>
        <button
          className={`tab-btn ${
            activeTab === 'addresses' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('addresses')}
        >
          <i className="fas fa-map-marker-alt"></i> Addresses
        </button>
        <button
          className={`tab-btn ${
            activeTab === 'settings' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('settings')}
        >
          <i className="fas fa-cog"></i> Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="overview-grid">
              <div className="info-card">
                <h3>Contact Information</h3>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{user?.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phone:</span>
                  <span className="value">
                    {user?.phone || 'Not provided'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Address:</span>
                  <span className="value">
                    {user?.address || 'Not provided'}
                  </span>
                </div>
              </div>

              <div className="info-card">
                <h3>Account Stats</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-value">3</div>
                    <div className="stat-label">Orders</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">₹4255</div>
                    <div className="stat-label">Total Spent</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">₹425</div>
                    <div className="stat-label">Savings</div>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Recent Orders</h3>
                <div className="recent-orders">
                  {mockOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="order-mini">
                      <span className="order-id">{order.id}</span>
                      <span className="order-date">
                        {order.date}
                      </span>
                      <span className="order-total">
                        ₹{order.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="tab-content">
            <h2>My Orders</h2>
            <div className="orders-list">
              {mockOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h4>{order.id}</h4>
                      <p className="order-date">{order.date}</p>
                    </div>
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      <i
                        className={getStatusIcon(order.status)}
                      ></i>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-body">
                    <div className="order-detail">
                      <span className="label">Items:</span>
                      <span className="value">{order.items}</span>
                    </div>
                    <div className="order-detail">
                      <span className="label">Total:</span>
                      <span className="value">₹{order.total}</span>
                    </div>
                  </div>
                  <div className="order-footer">
                    <button className="btn-track">
                      <i className="fas fa-location-arrow"></i>
                      Track Order
                    </button>
                    <button className="btn-reorder">
                      <i className="fas fa-redo"></i> Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="tab-content">
            <h2>Saved Addresses</h2>
            <div className="addresses-grid">
              <div className="address-card">
                <div className="address-type">Home</div>
                <p className="address-text">
                  123 Main Street, Delhi, India - 110001
                </p>
                <div className="address-actions">
                  <button className="btn-small">Edit</button>
                  <button className="btn-small btn-danger">
                    Delete
                  </button>
                </div>
              </div>

              <div className="address-card">
                <div className="address-type">Work</div>
                <p className="address-text">
                  456 Corporate Ave, Gurgaon, India - 122001
                </p>
                <div className="address-actions">
                  <button className="btn-small">Edit</button>
                  <button className="btn-small btn-danger">
                    Delete
                  </button>
                </div>
              </div>

              <div className="address-card add-new">
                <button className="btn-add-address">
                  <i className="fas fa-plus"></i> Add New Address
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="tab-content">
            <h2>Settings</h2>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Change Password</h4>
                  <p>Update your password regularly for security</p>
                </div>
                <button className="btn-setting">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Notification Preferences</h4>
                  <p>Manage email and SMS notifications</p>
                </div>
                <button className="btn-setting">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Privacy Settings</h4>
                  <p>Control your privacy and data sharing</p>
                </div>
                <button className="btn-setting">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h4>Two-Factor Authentication</h4>
                  <p>Add extra security to your account</p>
                </div>
                <button className="btn-setting">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              <div className="setting-item logout-item">
                <div className="setting-info">
                  <h4 className="logout-text">Logout</h4>
                  <p>Sign out from your account</p>
                </div>
                <button
                  className="btn-logout"
                  onClick={onLogout}
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
