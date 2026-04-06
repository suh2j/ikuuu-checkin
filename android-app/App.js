import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  AsyncStorage,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import axios from 'axios';

const App = () => {
  const [cookie, setCookie] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success', 'error', 'loading'
  const [history, setHistory] = useState([]);

  // 应用启动时加载保存的数据
  useEffect(() => {
    loadSavedData();
  }, []);

  // 加载保存的 Cookie 和历史记录
  const loadSavedData = async () => {
    try {
      const savedCookie = await AsyncStorage.getItem('ikuuu_cookie');
      if (savedCookie) {
        setCookie(savedCookie);
      }

      const savedHistory = await AsyncStorage.getItem('checkin_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // 保存 Cookie
  const saveCookie = async (cookieValue) => {
    try {
      await AsyncStorage.setItem('ikuuu_cookie', cookieValue);
    } catch (error) {
      console.error('Error saving cookie:', error);
    }
  };

  // 保存历史记录
  const saveHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem('checkin_history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  // 执行签到
  const performCheckin = async () => {
    if (!cookie.trim()) {
      Alert.alert('错误', '请先输入 Cookie');
      return;
    }

    setLoading(true);
    setStatus('');
    setStatusType('loading');
    setStatus('正在签到...');

    try {
      const response = await axios.post(
        'https://ikuuu.org/user/checkin',
        {},
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36',
            'Referer': 'https://ikuuu.org/user',
            'X-Requested-With': 'XMLHttpRequest',
            'Cookie': cookie,
          },
          timeout: 30000,
        }
      );

      const data = response.data;

      if (data.ret === 0) {
        setStatusType('success');
        setStatus(`✅ ${data.msg}`);
        addHistory('成功', data.msg);
      } else {
        setStatusType('error');
        setStatus(`❌ ${data.msg}`);
        addHistory('失败', data.msg);
      }

      // 保存 Cookie
      saveCookie(cookie);
    } catch (error) {
      setStatusType('error');
      const errorMsg = error.response?.data?.msg || error.message || '网络错误';
      setStatus(`❌ 错误: ${errorMsg}`);
      addHistory('错误', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 添加历史记录
  const addHistory = (status, message) => {
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN');

    const newItem = {
      time: timeStr,
      status: status,
      message: message,
    };

    const newHistory = [newItem, ...history].slice(0, 10);
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  // 清除 Cookie
  const clearCookie = () => {
    Alert.alert('确认', '确定要清除保存的 Cookie 吗？', [
      { text: '取消', onPress: () => {} },
      {
        text: '确定',
        onPress: async () => {
          setCookie('');
          try {
            await AsyncStorage.removeItem('ikuuu_cookie');
          } catch (error) {
            console.error('Error clearing cookie:', error);
          }
        },
      },
    ]);
  };

  // 清除历史记录
  const clearHistory = () => {
    Alert.alert('确认', '确定要清除历史记录吗？', [
      { text: '取消', onPress: () => {} },
      {
        text: '确定',
        onPress: async () => {
          setHistory([]);
          try {
            await AsyncStorage.removeItem('checkin_history');
          } catch (error) {
            console.error('Error clearing history:', error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* 头部 */}
        <View style={styles.header}>
          <Text style={styles.title}>iKuuu 签到助手</Text>
          <Text style={styles.subtitle}>一键快速签到，获取每日流量</Text>
        </View>

        {/* 信息框 */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📋 如何获取 Cookie？</Text>
          <Text style={styles.infoText}>
            {'\n'}电脑端：登录 iKuuu 官网 → F12 开发者工具 → Console → 输入 document.cookie{'\n'}
            {'\n'}手机端：用 Via 浏览器登录 → 点击左上角盾牌图标 → 查看 Cookies
          </Text>
        </View>

        {/* Cookie 输入框 */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>iKuuu Cookie</Text>
          <TextInput
            style={styles.input}
            placeholder="粘贴您的 Cookie 内容..."
            placeholderTextColor="#999"
            value={cookie}
            onChangeText={setCookie}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
        </View>

        {/* 按钮组 */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={performCheckin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>立即签到</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={clearCookie}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>清除</Text>
          </TouchableOpacity>
        </View>

        {/* 状态显示 */}
        {status ? (
          <View
            style={[
              styles.statusBox,
              statusType === 'success' && styles.statusSuccess,
              statusType === 'error' && styles.statusError,
              statusType === 'loading' && styles.statusLoading,
            ]}
          >
            <Text style={styles.statusText}>{status}</Text>
          </View>
        ) : null}

        {/* 历史记录 */}
        {history.length > 0 ? (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>签到历史</Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearHistoryBtn}>清除</Text>
              </TouchableOpacity>
            </View>

            {history.map((item, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyTime}>{item.time}</Text>
                <Text
                  style={[
                    styles.historyStatus,
                    item.status === '成功' && styles.statusSuccessText,
                    item.status === '失败' && styles.statusErrorText,
                    item.status === '错误' && styles.statusErrorText,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 18,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#667eea',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  statusBox: {
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  statusSuccess: {
    backgroundColor: '#e8f5e9',
    borderLeftColor: '#4caf50',
  },
  statusError: {
    backgroundColor: '#ffebee',
    borderLeftColor: '#f44336',
  },
  statusLoading: {
    backgroundColor: '#e3f2fd',
    borderLeftColor: '#2196f3',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historySection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  clearHistoryBtn: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  historyTime: {
    fontSize: 12,
    color: '#999',
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  statusSuccessText: {
    color: '#4caf50',
  },
  statusErrorText: {
    color: '#f44336',
  },
});

export default App;
