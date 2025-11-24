// src/components/AddressSelector.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Select, Form, Space, Spin } from 'antd';
import axios from 'axios';

const { Option } = Select;

/**
 * AddressSelector Component
 * Component để chọn địa chỉ giao hàng (Tỉnh → Huyện → Xã)
 * Sử dụng API esgoo.net để lấy dữ liệu địa giới Việt Nam
 * 
 * @param {Object} value - Giá trị hiện tại { province, district, ward }
 * @param {Function} onChange - Callback khi địa chỉ thay đổi
 * @param {Boolean} required - Có bắt buộc hay không
 */
export default function AddressSelector({ value = {}, onChange, required = true }) {
  const [provinceCode, setProvinceCode] = useState(value?.province || null);
  const [districtCode, setDistrictCode] = useState(value?.district || null);
  const [wardCode, setWardCode] = useState(value?.ward || null);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Load danh sách tỉnh khi component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoadingProvinces(true);
        // API esgoo.net: GET /api-tinhthanh/1/0.htm -> list tỉnh
        const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm', {
          timeout: 10000,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        let data = response.data;
        
        // Xử lý nhiều format response khác nhau
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.warn('AddressSelector: Response is not JSON, trying to parse HTML');
            // Nếu là HTML, có thể cần parse khác
          }
        }
        
        // Normalize về array
        let provincesList = [];
        if (Array.isArray(data)) {
          provincesList = data;
        } else if (data?.data && Array.isArray(data.data)) {
          provincesList = data.data;
        } else if (data?.results && Array.isArray(data.results)) {
          provincesList = data.results;
        } else if (typeof data === 'object') {
          // Nếu là object với keys là IDs
          provincesList = Object.values(data);
        }
        
        setProvinces(provincesList);
      } catch (error) {
        console.error('AddressSelector: Error loading provinces', error);
        // Fallback: có thể dùng dữ liệu tĩnh nếu API fail
        setProvinces([]);
      } finally {
        setLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  // Load danh sách huyện khi chọn tỉnh
  useEffect(() => {
    if (!provinceCode) {
      setDistricts([]);
      return;
    }

    const loadDistricts = async () => {
      try {
        setLoadingDistricts(true);
        // API esgoo.net: GET /api-tinhthanh/2/{province_id}.htm -> list huyện
        const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceCode}.htm`, {
          timeout: 10000,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        let data = response.data;
        
        // Xử lý nhiều format response khác nhau
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.warn('AddressSelector: Response is not JSON');
          }
        }
        
        // Normalize về array
        let districtsList = [];
        if (Array.isArray(data)) {
          districtsList = data;
        } else if (data?.data && Array.isArray(data.data)) {
          districtsList = data.data;
        } else if (data?.results && Array.isArray(data.results)) {
          districtsList = data.results;
        } else if (typeof data === 'object') {
          districtsList = Object.values(data);
        }
        
        setDistricts(districtsList);
      } catch (error) {
        console.error('AddressSelector: Error loading districts', error);
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    };

    loadDistricts();
  }, [provinceCode]);

  // Load danh sách xã khi chọn huyện
  useEffect(() => {
    if (!districtCode) {
      setWards([]);
      return;
    }

    const loadWards = async () => {
      try {
        setLoadingWards(true);
        // API esgoo.net: GET /api-tinhthanh/3/{district_id}.htm -> list xã
        const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${districtCode}.htm`, {
          timeout: 10000,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        let data = response.data;
        
        // Xử lý nhiều format response khác nhau
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) {
            console.warn('AddressSelector: Response is not JSON');
          }
        }
        
        // Normalize về array
        let wardsList = [];
        if (Array.isArray(data)) {
          wardsList = data;
        } else if (data?.data && Array.isArray(data.data)) {
          wardsList = data.data;
        } else if (data?.results && Array.isArray(data.results)) {
          wardsList = data.results;
        } else if (typeof data === 'object') {
          wardsList = Object.values(data);
        }
        
        setWards(wardsList);
      } catch (error) {
        console.error('AddressSelector: Error loading wards', error);
        setWards([]);
      } finally {
        setLoadingWards(false);
      }
    };

    loadWards();
  }, [districtCode]);

  // Tìm tên đầy đủ của tỉnh/huyện/xã
  const getProvinceName = (code) => {
    const province = provinces.find(p => p.id === code || p.code === code || p.Id === code);
    return province?.name || province?.Name || '';
  };

  const getDistrictName = (code) => {
    const district = districts.find(d => d.id === code || d.code === code || d.Id === code);
    return district?.name || district?.Name || '';
  };

  const getWardName = (code) => {
    const ward = wards.find(w => w.id === code || w.code === code || w.Id === code);
    return ward?.name || ward?.Name || '';
  };

  // Format địa chỉ đầy đủ
  const formatFullAddress = (province, district, ward) => {
    const parts = [];
    if (ward) parts.push(getWardName(ward));
    if (district) parts.push(getDistrictName(district));
    if (province) parts.push(getProvinceName(province));
    return parts.join(', ') || '';
  };

  // Xử lý khi chọn tỉnh
  const handleProvinceChange = (code) => {
    setProvinceCode(code);
    setDistrictCode(null); // Clear huyện khi đổi tỉnh
    setWardCode(null); // Clear xã khi đổi tỉnh
    
    const newValue = {
      province: code,
      district: null,
      ward: null,
      provinceName: getProvinceName(code),
      districtName: '',
      wardName: '',
      fullAddress: getProvinceName(code)
    };
    
    onChange?.(newValue);
  };

  // Xử lý khi chọn huyện
  const handleDistrictChange = (code) => {
    setDistrictCode(code);
    setWardCode(null); // Clear xã khi đổi huyện
    
    const newValue = {
      province: provinceCode,
      district: code,
      ward: null,
      provinceName: getProvinceName(provinceCode),
      districtName: getDistrictName(code),
      wardName: '',
      fullAddress: formatFullAddress(provinceCode, code, null)
    };
    
    onChange?.(newValue);
  };

  // Xử lý khi chọn xã
  const handleWardChange = (code) => {
    setWardCode(code);
    
    const newValue = {
      province: provinceCode,
      district: districtCode,
      ward: code,
      provinceName: getProvinceName(provinceCode),
      districtName: getDistrictName(districtCode),
      wardName: getWardName(code),
      fullAddress: formatFullAddress(provinceCode, districtCode, code)
    };
    
    onChange?.(newValue);
  };

  // Helper để lấy ID từ object (hỗ trợ nhiều format API)
  const getItemId = (item) => item?.id || item?.Id || item?.code || item?.Code;
  const getItemName = (item) => item?.name || item?.Name || '';

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* Tỉnh / Thành phố */}
      <Form.Item
        label="Tỉnh / Thành phố"
        name="province"
        rules={required ? [{ required: true, message: 'Vui lòng chọn Tỉnh / Thành phố' }] : []}
        style={{ marginBottom: 0 }}
      >
        <Select
          placeholder="Chọn Tỉnh / Thành phố"
          value={provinceCode}
          onChange={handleProvinceChange}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          size="large"
          loading={loadingProvinces}
          notFoundContent={loadingProvinces ? <Spin size="small" /> : 'Không tìm thấy'}
        >
          {provinces.map((province) => {
            const id = getItemId(province);
            const name = getItemName(province);
            return (
              <Option key={id} value={id} label={name}>
                {name}
              </Option>
            );
          })}
        </Select>
      </Form.Item>

      {/* Quận / Huyện */}
      <Form.Item
        label="Quận / Huyện"
        name="district"
        rules={required ? [{ required: true, message: 'Vui lòng chọn Quận / Huyện' }] : []}
        style={{ marginBottom: 0 }}
      >
        <Select
          placeholder="Chọn Quận / Huyện"
          value={districtCode}
          onChange={handleDistrictChange}
          disabled={!provinceCode}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          size="large"
          loading={loadingDistricts}
          notFoundContent={
            loadingDistricts 
              ? <Spin size="small" /> 
              : districts.length === 0 && provinceCode 
                ? 'Không tìm thấy' 
                : 'Vui lòng chọn Tỉnh / Thành phố trước'
          }
        >
          {districts.map((district) => {
            const id = getItemId(district);
            const name = getItemName(district);
            return (
              <Option key={id} value={id} label={name}>
                {name}
              </Option>
            );
          })}
        </Select>
      </Form.Item>

      {/* Phường / Xã */}
      <Form.Item
        label="Phường / Xã"
        name="ward"
        rules={required ? [{ required: true, message: 'Vui lòng chọn Phường / Xã' }] : []}
        style={{ marginBottom: 0 }}
      >
        <Select
          placeholder="Chọn Phường / Xã"
          value={wardCode}
          onChange={handleWardChange}
          disabled={!districtCode}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          size="large"
          loading={loadingWards}
          notFoundContent={
            loadingWards 
              ? <Spin size="small" /> 
              : wards.length === 0 && districtCode 
                ? 'Không tìm thấy' 
                : 'Vui lòng chọn Quận / Huyện trước'
          }
        >
          {wards.map((ward) => {
            const id = getItemId(ward);
            const name = getItemName(ward);
            return (
              <Option key={id} value={id} label={name}>
                {name}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
    </Space>
  );
}

