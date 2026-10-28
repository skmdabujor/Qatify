'use client';

// =============================================================================
// Qatify — Admin AliExpress Tracking Link & Sync Modal
// Allows dropship operators to link an AliExpress/Cainiao tracking code
// to any customer order and trigger an immediate live logistics sync.
// =============================================================================

import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import {
  Plane,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCw,
  Sparkles,
  Link2,
} from 'lucide-react';

interface AliExpressLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    _id: Id<'orders'>;
    orderNumber: string;
    trackingNumber: string;
    aliexpressTrackingNumber?: string;
    aliexpressCarrier?: string;
    address?: {
      fullName?: string;
      municipality?: string;
    };
    status: string;
  } | null;
  adminEmail?: string;
  onSuccess?: () => void;
}

export function AliExpressLinkModal({
  isOpen,
  onClose,
  order,
  adminEmail,
  onSuccess,
}: AliExpressLinkModalProps) {
  const [trackingInput, setTrackingInput] = useState(
    order?.aliexpressTrackingNumber || ''
  );
  const [carrier, setCarrier] = useState(order?.aliexpressCarrier || 'cainiao');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const linkMutation = useMutation(api.tracking.linkAliExpressTracking);

  // Sync state when order prop changes
  React.useEffect(() => {
    if (order) {
      setTrackingInput(order.aliexpressTrackingNumber || '');
      setCarrier(order.aliexpressCarrier || 'cainiao');
      setStatusMsg(null);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = trackingInput.trim().toUpperCase();

    if (!cleanCode) {
      setStatusMsg({
        type: 'error',
        text: 'Please enter a valid AliExpress or courier tracking number.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusMsg(null);

      await linkMutation({
        orderId: order._id,
        aliexpressTrackingNumber: cleanCode,
        carrier,
        adminEmail,
      });

      setStatusMsg({
        type: 'success',
        text: `Successfully linked ${cleanCode}! Live transit sync is running in the background.`,
      });

      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('Failed to link AliExpress tracking:', err);
      setStatusMsg({
        type: 'error',
        text: err?.message || 'Failed to link tracking number. Please check admin permissions.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#121216',
          border: '1px solid #27272a',
          borderRadius: '14px',
          width: '100%',
          maxWidth: '520px',
          padding: '24px',
          color: '#ffffff',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'transparent',
            border: 'none',
            color: '#a1a1aa',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#e06c2a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Plane size={18} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#ffffff' }}>
              Link AliExpress Logistics
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#a1a1aa' }}>
              Order: <strong style={{ color: '#facc15' }}>{order.orderNumber}</strong> • {order.address?.fullName || 'Customer'} ({order.address?.municipality || 'Qatar'})
            </p>
          </div>
        </div>

        {/* Informational Tip */}
        <div
          style={{
            backgroundColor: '#18181f',
            border: '1px solid #27272a',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '18px',
            fontSize: '12px',
            lineHeight: 1.5,
            color: '#d4d4d8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#facc15', fontWeight: 600, marginBottom: '4px' }}>
            <Sparkles size={14} />
            <span>White-Labeling & Auto-Sync Protection</span>
          </div>
          Paste the tracking code you received from your AliExpress / Cainiao supplier. Qatify will continuously fetch real-time milestones and display them to your customer in Qatify&apos;s luxury branded layout (masking any Chinese supplier references).
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#d4d4d8',
                marginBottom: '6px',
              }}
            >
              AliExpress / International Tracking Number
            </label>
            <input
              type="text"
              placeholder="e.g. LP00684920481234 or YT230198421"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#1a1a22',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                color: '#ffffff',
                fontFamily: 'monospace',
                fontSize: '14px',
                outline: 'none',
              }}
              required
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#d4d4d8',
                marginBottom: '6px',
              }}
            >
              Logistics Line / Carrier
            </label>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                backgroundColor: '#1a1a22',
                border: '1px solid #3f3f46',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
              }}
            >
              <option value="cainiao">Cainiao Global / AliExpress Standard Shipping (Recommended)</option>
              <option value="yanwen">Yanwen Direct Air Express</option>
              <option value="sunyou">SunYou Special Economy</option>
              <option value="4px">4PX Air Express</option>
              <option value="china_post">ePacket / China Post Air</option>
              <option value="other">Other International Freight Carrier</option>
            </select>
          </div>

          {statusMsg && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: statusMsg.type === 'success' ? '#34d399' : '#f87171',
                border: `1px solid ${statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              }}
            >
              {statusMsg.type === 'success' ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px 14px',
                backgroundColor: '#27272a',
                border: 'none',
                borderRadius: '8px',
                color: '#d4d4d8',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 2,
                padding: '10px 14px',
                backgroundColor: '#e06c2a',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isSubmitting ? (
                <>
                  <RotateCw size={14} className="spin" />
                  <span>Linking & Syncing...</span>
                </>
              ) : (
                <>
                  <Link2 size={15} />
                  <span>Link & Sync Live Status</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

