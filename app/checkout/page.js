"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { formatPrice, site } from "@/lib/site";

const steps = ["Details", "Payment", "Confirm"];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [method, setMethod] = useState(site.payments.bank.enabled ? "bank" : "jazzcash");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    txnId: "",
    notes: "",
  });
  const paymentConfigured = site.payments.bank.enabled || site.payments.jazzcash.enabled;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submitOrder() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          phone: form.phone,
          address: `${form.address}, ${form.city}`,
          payment_method: method,
          transaction_id: form.txnId,
          notes: form.notes,
          items,
          total,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      clearCart();
      setStep(2);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0 && step !== 2) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-3xl mb-4">Nothing to check out</h1>
        <button className="btn btn-primary" onClick={() => router.push("/shop")}>
          Back to shop
        </button>
      </div>
    );
  }

  return (
    <div className="container-x py-16 max-w-2xl">
      {step < 2 && (
        <div className="flex gap-6 mb-12 text-sm">
          {steps.slice(0, 2).map((s, i) => (
            <div key={s} className={`flex items-center gap-2 ${i === step ? "text-ink" : "text-ink/35"}`}>
              <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">
                {i + 1}
              </span>
              {s}
            </div>
          ))}
        </div>
      )}

      {step === 0 && (
        <div>
          <h1 className="text-3xl mb-8">Your details</h1>
          <div className="grid gap-5">
            <Field label="Full name" value={form.name} onChange={(v) => update("name", v)} />
            <Field label="Phone number" value={form.phone} onChange={(v) => update("phone", v)} />
            <Field label="Address" value={form.address} onChange={(v) => update("address", v)} />
            <Field label="City" value={form.city} onChange={(v) => update("city", v)} />
          </div>
          <button
            className="btn btn-primary mt-8"
            disabled={!form.name || !form.phone || !form.address}
            onClick={() => setStep(1)}
          >
            Continue to payment
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <h1 className="text-3xl mb-8">Payment</h1>

          <div className="flex gap-3 mb-6">
            {site.payments.bank.enabled && (
              <button
                className={`btn ${method === "bank" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setMethod("bank")}
              >
                Bank transfer
              </button>
            )}
            {site.payments.jazzcash.enabled && (
              <button
                className={`btn ${method === "jazzcash" ? "btn-primary" : "btn-outline"}`}
                onClick={() => setMethod("jazzcash")}
              >
                JazzCash
              </button>
            )}
          </div>

          {!site.payments.bank.enabled && !site.payments.jazzcash.enabled && (
            <div className="border border-dashed border-ink/20 p-6 text-sm text-ink/50 mb-6">
              No payment account is configured yet. Add your bank or JazzCash
              details to the env vars (README §4) so customers can see where to send payment.
            </div>
          )}

          {method === "bank" && site.payments.bank.enabled && (
            <div className="border border-ink/15 p-6 mb-6 text-sm space-y-1.5">
              <Row label="Bank" value={site.payments.bank.bankName} />
              <Row label="Account title" value={site.payments.bank.accountTitle} />
              <Row label="Account number" value={site.payments.bank.accountNumber} />
              {site.payments.bank.iban && <Row label="IBAN" value={site.payments.bank.iban} />}
              <Row label="Amount to send" value={formatPrice(total)} strong />
            </div>
          )}

          {method === "jazzcash" && site.payments.jazzcash.enabled && (
            <div className="border border-ink/15 p-6 mb-6 text-sm space-y-1.5">
              <Row label="JazzCash account title" value={site.payments.jazzcash.accountTitle} />
              <Row label="JazzCash number" value={site.payments.jazzcash.number} />
              <Row label="Amount to send" value={formatPrice(total)} strong />
            </div>
          )}

          <p className="text-sm text-ink/60 mb-5">
            Send the amount above, then enter the transaction ID / reference number
            from your payment so we can confirm your order.
          </p>

          <div className="grid gap-5">
            <Field label="Transaction ID / reference" value={form.txnId} onChange={(v) => update("txnId", v)} />
            <Field label="Notes (optional)" value={form.notes} onChange={(v) => update("notes", v)} optional />
          </div>

          {error && <p className="text-sm text-rose mt-4">{error}</p>}

          <div className="flex gap-3 mt-8">
            <button className="btn btn-outline" onClick={() => setStep(0)}>
              Back
            </button>
            <button
              className="btn btn-primary flex-1"
              disabled={!paymentConfigured || !form.txnId || submitting}
              onClick={submitOrder}
            >
              {submitting ? "Placing order…" : "Place order"}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="text-center py-10">
          <h1 className="text-3xl mb-4">Order received</h1>
          <p className="text-ink/60 max-w-md mx-auto mb-8">
            Thank you, {form.name.split(" ")[0]}. We&apos;re verifying your payment and
            will message you on {form.phone} to confirm delivery details.
          </p>
          <a href={site.instagramUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
            Follow us for updates
          </a>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, optional }) {
  return (
    <label className="block">
      <span className="text-xs text-ink/50 mb-1.5 block">
        {label} {optional && <span className="text-ink/30">(optional)</span>}
      </span>
      <input
        className="w-full border border-ink/25 px-4 py-2.5 bg-transparent focus-ring outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Row({ label, value, strong }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink/50">{label}</span>
      <span className={strong ? "font-medium" : ""}>{value}</span>
    </div>
  );
}
