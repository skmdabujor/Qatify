'use client';

// =============================================================================
// Qatify — Admin Telegram Order Alerts Manager
// Allows store owners to add/remove Telegram Chat IDs, manage bot tokens,
// toggle alerts, and send instant test messages.
// =============================================================================

import React, { useState } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Key,
  Power,
  HelpCircle,
  Loader2,
  Check,
  MessageCircle,
} from 'lucide-react';

export function TelegramAlertsManager() {
  const recipients = useQuery(api.telegram.listRecipients);
  const addRecipient = useMutation(api.telegram.addRecipient);
  const removeRecipient = useMutation(api.telegram.removeRecipient);
  const toggleRecipient = useMutation(api.telegram.toggleRecipient);
  const testSendAction = useAction(api.telegram.testSendTelegram);

  // Local state for adding a new recipient
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newChatId, setNewChatId] = useState('');
  const [newBotToken, setNewBotToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Test message status
  const [testingId, setTestingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Setup instructions collapsible
  const [showGuide, setShowGuide] = useState(true);

  // Handle adding new recipient
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatId.trim() || !newName.trim()) return;

    try {
      setIsSubmitting(true);
      await addRecipient({
        name: newName.trim(),
        chatId: newChatId.trim(),
        botToken: newBotToken.trim() || undefined,
        isActive: true,
      });

      setNewName('');
      setNewChatId('');
      setNewBotToken('');
      setShowAddForm(false);
      setFeedback({
        type: 'success',
        message: `Chat ID ${newChatId} successfully added for Telegram alerts!`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Failed to add recipient: ${String(err)}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting recipient
  const handleDelete = async (id: Id<'telegram_recipients'>, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from Telegram alerts?`)) {
      return;
    }
    try {
      await removeRecipient({ id });
      setFeedback({
        type: 'info',
        message: `${name} removed from Telegram alerts.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Failed to delete: ${String(err)}`,
      });
    }
  };

  // Handle toggle active/inactive
  const handleToggle = async (id: Id<'telegram_recipients'>) => {
    try {
      const res = await toggleRecipient({ id });
      setFeedback({
        type: 'info',
        message: `Telegram alerts ${res.isActive ? 'enabled' : 'disabled'}.`,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Failed to toggle: ${String(err)}`,
      });
    }
  };

  // Handle sending test message
  const handleTestSend = async (idKey: string, chatId?: string, botToken?: string) => {
    try {
      setTestingId(idKey);
      setFeedback({
        type: 'info',
        message: `Sending test Telegram alert to ${chatId || 'configured Chat ID'}...`,
      });

      const res = await testSendAction({ chatId, botToken });

      if (res.success) {
        setFeedback({
          type: 'success',
          message: res.message,
        });
      } else {
        setFeedback({
          type: 'error',
          message: res.message,
        });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message: `Test message failed: ${String(err)}`,
      });
    } finally {
      setTestingId(null);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e4e4e7',
        borderRadius: '12px',
        padding: '24px',
        marginTop: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid #f1f3f5',
          paddingBottom: '16px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: '#0088cc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Send size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#18181b' }}>
              Telegram Order Alerts Manager
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#71717a' }}>
              Instant real-time order alerts sent directly to your Telegram chat or group
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => handleTestSend('global-test')}
            disabled={testingId !== null}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f4f4f5',
              border: '1px solid #e4e4e7',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#18181b',
              cursor: 'pointer',
            }}
          >
            {testingId === 'global-test' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            Send Global Test
          </button>

          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#0088cc',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            <Plus size={16} />
            Add Telegram Recipient
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor:
              feedback.type === 'success'
                ? '#f0fdf4'
                : feedback.type === 'error'
                ? '#fef2f2'
                : '#eff6ff',
            border: `1px solid ${
              feedback.type === 'success'
                ? '#bbf7d0'
                : feedback.type === 'error'
                ? '#fecaca'
                : '#bfdbfe'
            }`,
            color:
              feedback.type === 'success'
                ? '#166534'
                : feedback.type === 'error'
                ? '#991b1b'
                : '#1e40af',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {feedback.type === 'success' ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              fontWeight: 700,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Setup Instructions Collapsible */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          onClick={() => setShowGuide(!showGuide)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={18} color="#0088cc" />
            <strong style={{ fontSize: '14px', color: '#1e293b' }}>
              How to set up Telegram Bot & Chat ID (takes 1 minute)
            </strong>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b', textDecoration: 'underline' }}>
            {showGuide ? 'Hide Instructions' : 'Show Instructions'}
          </span>
        </div>

        {showGuide && (
          <div style={{ marginTop: '14px', fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
            <ol style={{ paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Create Bot Token:</strong> Open Telegram and search for <strong>@BotFather</strong>. Send <code>/newbot</code>, choose a bot name & username. BotFather will give you a <strong>HTTP API Token</strong> (e.g. <code>728192849:AAH...</code>).
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Start Your Bot:</strong> Search for your newly created bot username in Telegram and click <strong>Start</strong> (or send <code>/start</code>).
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Get Your Chat ID:</strong> Search for <strong>@userinfobot</strong> in Telegram and click Start. It will immediately show your numeric <strong>Id</strong> (e.g. <code>128491823</code>).
              </li>
              <li>
                <strong>Add Below:</strong> Enter your Chat ID and Bot Token below, or save them in <code>.env.local</code> as <code>TELEGRAM_BOT_TOKEN</code> and <code>TELEGRAM_CHAT_ID</code>.
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* Add Recipient Form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          style={{
            backgroundColor: '#f9fafb',
            border: '1px dashed #cbd5e1',
            borderRadius: '10px',
            padding: '18px',
            marginBottom: '20px',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
            Add New Telegram Alert Target
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              marginBottom: '14px',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                Recipient Name *
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Store Owner, Operations"
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                Telegram Chat ID * (Numeric or Group ID)
              </label>
              <input
                type="text"
                value={newChatId}
                onChange={(e) => setNewChatId(e.target.value)}
                placeholder="e.g. 128491823"
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                Bot Token (Optional, uses default if empty)
              </label>
              <input
                type="password"
                value={newBotToken}
                onChange={(e) => setNewBotToken(e.target.value)}
                placeholder="e.g. 728192849:AAH..."
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#0088cc',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save Recipient'}
            </button>
          </div>
        </form>
      )}

      {/* Recipients Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e4e4e7', color: '#71717a' }}>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Recipient Name</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Chat ID</th>
              <th style={{ padding: '10px 12px', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipients === undefined ? (
              <tr>
                <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#71717a' }}>
                  Loading Telegram recipients...
                </td>
              </tr>
            ) : recipients.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#71717a' }}>
                  No Telegram recipients added yet. You can add one above or configure <code>TELEGRAM_BOT_TOKEN</code> & <code>TELEGRAM_CHAT_ID</code> in <code>.env.local</code>.
                </td>
              </tr>
            ) : (
              recipients.map((rec) => (
                <tr key={rec._id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#18181b' }}>
                    {rec.name}
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'monospace', color: '#3f3f46' }}>
                    {rec.chatId}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: rec.isActive ? '#dcfce7' : '#f4f4f5',
                        color: rec.isActive ? '#15803d' : '#71717a',
                      }}
                    >
                      {rec.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => handleTestSend(rec._id, rec.chatId, rec.botToken)}
                        disabled={testingId !== null}
                        title="Send Test Message"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #e4e4e7',
                          backgroundColor: '#ffffff',
                          color: '#0088cc',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                        }}
                      >
                        {testingId === rec._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Send size={12} />
                        )}
                        Test
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggle(rec._id)}
                        title={rec.isActive ? 'Disable Alerts' : 'Enable Alerts'}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #e4e4e7',
                          backgroundColor: '#ffffff',
                          color: rec.isActive ? '#ea580c' : '#16a34a',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                        }}
                      >
                        <Power size={12} />
                        {rec.isActive ? 'Disable' : 'Enable'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(rec._id, rec.name)}
                        title="Delete Recipient"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #fecaca',
                          backgroundColor: '#ffffff',
                          color: '#dc2626',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

