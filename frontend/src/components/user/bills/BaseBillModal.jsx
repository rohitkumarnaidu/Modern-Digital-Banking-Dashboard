import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EnterPinModal from "../payments/EnterPinModal";

const BaseBillModal = ({ title, children, confirmData, onClose }) => {
  const navigate = useNavigate();
  const [showPin, setShowPin] = useState(false);

  return (
    <>
      {/* MAIN MODAL */}
      {!showPin && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            {children({ openPin: () => setShowPin(true) })}
          </div>
        </div>
      )}

      {/* PIN MODAL */}
      <EnterPinModal
        open={showPin}
        onClose={() => setShowPin(false)}
        onConfirm={(pin) => {
          setShowPin(false);
          onClose();

          navigate("/dashboard/bill-processing", {
            state: {
              bill_id: confirmData.bill_id ?? null,
              account_id: confirmData.account_id,
              amount: confirmData.amount,
              pin,
              bill_type: confirmData.bill_type,
              provider: confirmData.provider || null,
              reference_id: crypto.randomUUID(),
              to: confirmData.to,
            },
          });
        }}
      />
    </>
  );
};

export default BaseBillModal;
