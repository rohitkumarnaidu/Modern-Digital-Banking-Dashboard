import { useState } from "react";
import BaseBillModal from "./BaseBillModal";

const FastagRechargeModal = ({ onClose, selectedAccountId }) => {
  const [step, setStep] = useState(1);
  const [vehicleNo, setVehicleNo] = useState("");
  const [amount, setAmount] = useState("");

  const isValidVehicle = vehicleNo.length >= 6;
  const isValidAmount = Number(amount) > 0;

  const reset = () => {
    setStep(1);
    setVehicleNo("");
    setAmount("");
    onClose();
  };

  return (
    <BaseBillModal
      title="FASTag Recharge"
      onClose={onClose}
      confirmData={{
        to: vehicleNo,
        amount,
        bill_type: "fastag",
        provider: "FASTag",
        account_id: selectedAccountId,
      }}
    >
      {({ openPin }) => (
        <>
          {step === 1 && (
            <div className="space-y-6">
              <input
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                placeholder="TN09AB1234"
                className="w-full border rounded-xl px-4 py-3"
              />
              <button
                disabled={!isValidVehicle}
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl"
              >
                Continue
              </button>

              <button onClick={reset} className="text-sm text-gray-500">
                Cancel
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <button onClick={() => setStep(1)} className="text-sm text-blue-600">
                ← Back
              </button>

              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Recharge Amount"
                className="w-full border rounded-xl px-4 py-3"
              />

              <button
                disabled={!isValidAmount}
                onClick={openPin}
                className="w-full bg-blue-600 text-white py-3 rounded-xl"
              >
                Pay ₹{amount}
              </button>

              <button onClick={reset} className="text-sm text-gray-500">
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </BaseBillModal>
  );
};

export default FastagRechargeModal;
