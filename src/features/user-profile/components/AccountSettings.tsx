import { useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Crown,
  Key,
  Zap,
  Trash2,
  Moon,
  Sun,
  CreditCard,
  Receipt,
  AlertTriangle,
  CheckCircle,
  X,
  Copy,
  Smartphone,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

interface AccountSettingsProps {
  onClose?: () => void;
}

export function AccountSettings({ onClose }: AccountSettingsProps) {
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'security' | 'premium' | 'api' | 'integrations' | 'billing' | 'appearance'>('security');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Primary API Key', key: 'imo_4f3d2c1b0a9e8d7c6b5a49382716f', created: '2024-01-15', lastUsed: '2024-11-05' },
    { id: '2', name: 'Webhook Key', key: 'web_9g8h7i6j5k4l3m2n1o0p9q8r7s6t', created: '2024-06-20', lastUsed: '2024-11-04' }
  ]);
  const [integrations, setIntegrations] = useState([
    { id: 'zapier', name: 'Zapier', description: 'Automate workflows', connected: true, icon: Zap },
    { id: 'slack', name: 'Slack', description: 'Team notifications', connected: false, icon: Smartphone },
    { id: 'google', name: 'Google Workspace', description: 'Calendar integration', connected: false, icon: Globe }
  ]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.new.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    // Mock password change
    toast.success('Password updated successfully!');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleForgotPassword = () => {
    toast.success('Password reset email sent!');
  };

  const generateApiKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: 'New API Key',
      key: 'imo_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success('New API key generated!');
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    toast.success('API key deleted!');
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id
        ? { ...integration, connected: !integration.connected }
        : integration
    ));
    const integration = integrations.find(i => i.id === id);
    toast.success(`${integration?.name} ${!integration?.connected ? 'connected' : 'disconnected'}!`);
  };

  const handleDeleteAccount = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    // Mock account deletion
    toast.success('Account deletion request submitted. You will receive a confirmation email.');
    setShowDeleteConfirm(false);
    // In real app, redirect to home or sign out
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const tabs = [
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'premium', label: 'Premium', icon: Crown },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: theme === 'dark' ? Moon : Sun }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="relative bg-card rounded-3xl shadow-2xl max-w-4xl w-full my-8 animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-heading text-foreground">Account Settings</h2>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-64 border-r border-border p-4">
                <nav className="space-y-2">
                  {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'security' | 'premium' | 'api' | 'integrations' | 'billing' | 'appearance')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'security' && (
                  <div className="space-y-8">
                    {/* Password Change */}
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <h3 className="text-xl font-heading mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? 'text' : 'password'}
                              value={passwordData.current}
                              onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={passwordData.new}
                              onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={passwordData.confirm}
                              onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={handlePasswordChange}
                            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            Update Password
                          </button>
                          <button
                            onClick={handleForgotPassword}
                            className="px-6 py-3 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            Forgot Password?
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delete Account */}
                    <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
                      <h3 className="text-xl font-heading mb-4 text-destructive">Danger Zone</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <AlertTriangle className="w-6 h-6 text-destructive mt-1" />
                          <div className="flex-1">
                            <h4 className="font-medium">Delete Account</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleDeleteAccount}
                          className={`px-6 py-3 rounded-lg transition-colors ${
                            showDeleteConfirm
                              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                              : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                          }`}
                        >
                          {showDeleteConfirm ? 'Confirm Delete Account' : 'Delete Account'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'premium' && (
                  <div className="space-y-6">
                    {/* Current Plan */}
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-heading">Current Plan</h3>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Free Plan</span>
                      </div>
                      <p className="text-muted-foreground">You&apos;re on the free plan with basic features.</p>
                    </div>

                    {/* Upgrade Options */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="border border-border rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Crown className="w-6 h-6 text-amber-500" />
                          <h3 className="text-xl font-heading">Premium Agent</h3>
                        </div>
                        <p className="text-muted-foreground mb-4">Advanced features for real estate professionals</p>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Unlimited property listings
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Advanced analytics
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Priority support
                          </li>
                        </ul>
                        <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                          Upgrade to Premium - $29/month
                        </button>
                      </div>

                      <div className="border border-border rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Crown className="w-6 h-6 text-purple-500" />
                          <h3 className="text-xl font-heading">Enterprise Agency</h3>
                        </div>
                        <p className="text-muted-foreground mb-4">Complete solution for real estate agencies</p>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Everything in Premium
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Team management
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            White-label solution
                          </li>
                        </ul>
                        <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                          Contact Sales - Custom pricing
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'api' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-heading">API Keys</h3>
                      <button
                        onClick={generateApiKey}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Generate New Key
                      </button>
                    </div>

                    <div className="space-y-4">
                      {apiKeys.map((key) => (
                        <div key={key.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{key.name}</h4>
                            <button
                              onClick={() => deleteApiKey(key.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <code className="flex-1 px-3 py-2 bg-muted rounded font-mono text-sm">{key.key}</code>
                            <button
                              onClick={() => copyToClipboard(key.key)}
                              className="p-2 hover:bg-muted rounded"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Created: {key.created} • Last used: {key.lastUsed}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'integrations' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-heading">Integrations</h3>
                    <div className="space-y-4">
                      {integrations.map((integration) => {
                        const Icon = integration.icon;
                        return (
                          <div key={integration.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                <Icon className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-medium">{integration.name}</h4>
                                <p className="text-sm text-muted-foreground">{integration.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-xs ${
                                integration.connected
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {integration.connected ? 'Connected' : 'Disconnected'}
                              </span>
                              <button
                                onClick={() => toggleIntegration(integration.id)}
                                className={`px-4 py-2 rounded-lg transition-colors ${
                                  integration.connected
                                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                }`}
                              >
                                {integration.connected ? 'Disconnect' : 'Connect'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    {/* Subscription */}
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <h3 className="text-xl font-heading mb-4">Subscription</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Free Plan</p>
                          <p className="text-sm text-muted-foreground">Basic features included</p>
                        </div>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                          Upgrade Plan
                        </button>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <h3 className="text-xl font-heading mb-4">Payment Methods</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-6 h-6" />
                            <div>
                              <p className="font-medium">•••• •••• •••• 4242</p>
                              <p className="text-sm text-muted-foreground">Expires 12/26</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 text-destructive hover:bg-destructive/10 rounded">
                            Remove
                          </button>
                        </div>
                        <button className="w-full px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors">
                          Add Payment Method
                        </button>
                      </div>
                    </div>

                    {/* Invoices */}
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <h3 className="text-xl font-heading mb-4">Invoices</h3>
                      <div className="space-y-4">
                        {[
                          { id: 'inv_001', date: '2024-11-01', amount: '$0.00', status: 'Paid' },
                          { id: 'inv_002', date: '2024-10-01', amount: '$0.00', status: 'Paid' },
                        ].map((invoice) => (
                          <div key={invoice.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                            <div>
                              <p className="font-medium">{invoice.id}</p>
                              <p className="text-sm text-muted-foreground">{invoice.date}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-medium">{invoice.amount}</span>
                              <span className={`px-3 py-1 rounded-full text-xs ${
                                invoice.status === 'Paid'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                              }`}>
                                {invoice.status}
                              </span>
                              <button className="p-2 hover:bg-muted rounded">
                                <Receipt className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-heading">Appearance</h3>

                    {/* Theme Toggle */}
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <h4 className="text-lg font-medium mb-4">Theme</h4>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setTheme('light')}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                            theme === 'light'
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          <Sun className="w-5 h-5" />
                          <span>Light</span>
                        </button>
                        <button
                          onClick={() => setTheme('dark')}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                            theme === 'dark'
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          <Moon className="w-5 h-5" />
                          <span>Dark</span>
                        </button>
                        <button
                          onClick={() => setTheme('system')}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                            theme === 'system'
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          <Globe className="w-5 h-5" />
                          <span>System</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}