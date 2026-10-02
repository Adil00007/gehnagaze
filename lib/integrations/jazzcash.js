// ---------------------------------------------------------------------------
// JazzCash automatic checkout — FRAME ONLY, not yet called anywhere.
// ---------------------------------------------------------------------------
// Today, checkout collects orders as "pay to this JazzCash/bank number, then
// tell us the transaction ID" (see app/checkout/page.js). That works with
// zero paperwork and is how most small PK storefronts operate.
//
// To upgrade to instant, automatic JazzCash checkout (customer redirected to
// JazzCash, comes back paid) you need a Merchant Account from JazzCash
// (business/mobile account + their onboarding form — takes a few days), which
// gives you three secrets. Once you have them, add to your env vars:
//
//   JAZZCASH_MERCHANT_ID
//   JAZZCASH_PASSWORD
//   JAZZCASH_INTEGRITY_SALT
//   JAZZCASH_ENV               ("sandbox" or "live")
//   JAZZCASH_RETURN_URL         (e.g. https://yourdomain.com/api/jazzcash/return)
//
// then wire buildJazzCashRequest() below into app/checkout/page.js's "Pay with
// JazzCash" button (POST the returned fields to JAZZCASH_POST_URL as an
// auto-submitting form). Test in the sandbox before going live — do not skip
// that step, a wrong integrity salt silently fails payments.
// ---------------------------------------------------------------------------

import crypto from "crypto";

export const JAZZCASH_POST_URL =
  process.env.JAZZCASH_ENV === "live"
    ? "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/"
    : "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";

export function isJazzCashConfigured() {
  return Boolean(
    process.env.JAZZCASH_MERCHANT_ID &&
      process.env.JAZZCASH_PASSWORD &&
      process.env.JAZZCASH_INTEGRITY_SALT
  );
}

// amountInPkr: number, e.g. 4500 (whole rupees). orderRefNumber: your order id.
export function buildJazzCashRequest({ amountInPkr, orderRefNumber, description }) {
  if (!isJazzCashConfigured()) {
    throw new Error(
      "JazzCash credentials are missing. Add JAZZCASH_MERCHANT_ID, JAZZCASH_PASSWORD " +
        "and JAZZCASH_INTEGRITY_SALT to your env vars first."
    );
  }

  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const txnDateTime = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const expiry = new Date(now.getTime() + 60 * 60 * 1000);
  const txnExpiryDateTime = `${expiry.getFullYear()}${pad(
    expiry.getMonth() + 1
  )}${pad(expiry.getDate())}${pad(expiry.getHours())}${pad(
    expiry.getMinutes()
  )}${pad(expiry.getSeconds())}`;

  const fields = {
    pp_Version: "1.1",
    pp_TxnType: "MWALLET",
    pp_Language: "EN",
    pp_MerchantID: process.env.JAZZCASH_MERCHANT_ID,
    pp_Password: process.env.JAZZCASH_PASSWORD,
    pp_TxnRefNo: orderRefNumber,
    pp_Amount: String(Math.round(amountInPkr * 100)), // paisas
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: txnDateTime,
    pp_TxnExpiryDateTime: txnExpiryDateTime,
    pp_BillReference: orderRefNumber,
    pp_Description: description || `Order ${orderRefNumber}`,
    pp_ReturnURL: process.env.JAZZCASH_RETURN_URL || "",
    pp_SecureHash: "", // filled below
  };

  // JazzCash's documented hash: sort fields A→Z, join non-empty values with
  // "&", prefix the integrity salt, then HMAC-SHA256 with the salt as key.
  const sortedKeys = Object.keys(fields)
    .filter((k) => k !== "pp_SecureHash" && fields[k])
    .sort();
  const hashString =
    process.env.JAZZCASH_INTEGRITY_SALT +
    "&" +
    sortedKeys.map((k) => fields[k]).join("&");
  fields.pp_SecureHash = crypto
    .createHmac("sha256", process.env.JAZZCASH_INTEGRITY_SALT)
    .update(hashString)
    .digest("hex")
    .toUpperCase();

  return { postUrl: JAZZCASH_POST_URL, fields };
}
