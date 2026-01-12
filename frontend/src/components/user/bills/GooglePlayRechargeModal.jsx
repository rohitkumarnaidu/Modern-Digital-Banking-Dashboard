import { useState } from "react";
import BaseBillModal from "./BaseBillModal";

const GooglePlayRechargeModal = ({ onClose, selectedAccountId }) => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  const isValidEmail = email.includes("@");
  const isValidAmount = Number(amount) > 0;

  const reset = () => {
    setEmail("");
    setAmount("");
    onClose();
  };

  return (
    <BaseBillModal
      title="Google Play Recharge"
      onClose={onClose}
      confirmData={{
        to: email,
        amount,
        bill_type: "google_play",
        provider: "Google Play",
        account_id: selectedAccountId,
      }}
    >
      {({ openPin }) => (
        <div className="space-y-5">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Google account email"
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full border rounded-xl px-4 py-3"
          />

          <button
            disabled={!isValidEmail || !isValidAmount}
            onClick={openPin}
            className="w-full bg-blue-600 text-white py-3 rounded-xl disabled:opacity-40"
          >
            Pay ₹{amount}
          </button>

          <button onClick={reset} className="text-sm text-gray-500">
            Cancel
          </button>
        </div>
      )}
    </BaseBillModal>
  );
};

export default GooglePlayRechargeModal;
