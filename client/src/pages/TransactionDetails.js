import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const TransactionDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get("session_id");

  const [transactionDetails, setTransactionDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Session ID:", sessionId);
    if (sessionId) {
      retrieveSession();
    }
  }, [sessionId]);

  async function retrieveSession() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/parking/payment/retrieve-complete/${sessionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setTransactionDetails(data);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-4 p-8 text-sm">
      <div className="flex w-full justify-center items-center">
        {/* HEADER */}
        <div className="flex flex-col gap-4">
          {/* LOGO */}
          <div className="flex flex-col gap-2">
            <p className="text-3xl">
              <b>ESPACE</b>
            </p>
            <p className="text-lg text-center">
              <b>Properties</b>
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <p className="my-text-orange">
          <b>Thank you for your payment!</b>
        </p>
      </div>
      <div className="flex flex-col w-full justify-center">
        <p className="text-center">Your booking has been confirmed.</p>
        {/* <p className="text-center">
          An email has been sent to{" "}
          <span className="my-text-light-blue">
            {transactionDetails.customerEmail}
          </span>{" "}
          with more details
        </p> */}
      </div>
      <div className="flex flex-col gap-4 bs-light p-4 rounded tr-detail-comp">
        <div className="flex flex-col justify-center">
          <p className="text-center">
            <b className="my-text-blue">Transaction #</b>
          </p>
          <p className="text-center" style={{ fontSize: "0.65rem" }}>
            {transactionDetails.id}
          </p>
        </div>
        <div className="flex justify-between mt-4">
          <p>
            <b className="my-text-blue">Payment Status</b>
          </p>
          <p className="uppercase">{transactionDetails.paymentStatus}</p>
        </div>
        <div className="flex justify-between">
          <p>
            <b className="my-text-blue">Payment Method</b>
          </p>
          <div>
            <span className="uppercase">{transactionDetails.cardType}</span>{" "}
            ending in {transactionDetails.paymentCardEnding}
          </div>
        </div>
        <div className="flex justify-between">
          <p>
            <b className="my-text-blue">Total</b>
          </p>
          <p>$ {transactionDetails.total.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>
            <b className="my-text-blue">Currency</b>
          </p>
          <p className="uppercase">{transactionDetails.currency}</p>
        </div>
        <div className="flex justify-between">
          <p>
            <b className="my-text-blue">Parking Bill</b>
          </p>
          <div
            id="trans-det-date"
            className="flex gap-2 text-xs"
            style={{ fontStyle: "italic" }}
          >
            <p className="trans-det-days">
              {transactionDetails.quantity}-
              {transactionDetails.quantity > 1 ? "Days" : "Day"}
            </p>
            <p id="trans-det-separator">/</p>
            <p className="trans-date-slot">{transactionDetails.slotBooked}</p>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <p>
              <b className="my-text-blue">Bill To</b>
            </p>
          </div>
          <div className="flex flex-col text-right">
            <p>{transactionDetails.customerName}</p>
            <p className="my-text-light-blue">
              {transactionDetails.customerEmail}
            </p>
            <p>{transactionDetails.customerBillTo}</p>
          </div>
        </div>
      </div>
      <div className="tr-detail-comp">
        <button
          className="buttonBig rounded"
          onClick={() => {
            navigate("/");
          }}
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default TransactionDetails;
