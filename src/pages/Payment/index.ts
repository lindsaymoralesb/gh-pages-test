import React, { useState, useRef } from "react";
import Card, { Focused } from "react-credit-cards-2";

import "react-credit-cards-2/dist/es/styles-compiled.css"

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
  formatFormData
} from "./utils/payment";

const App = () => {
  const [number, setNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("");
  const [cvc, setCvc] = useState<string>("");
  const [focused, setFocused] = useState<Focused>("");
  const [issuer, setIssuer] = useState<string>("");
  const [formData, setFormData] = useState(null);

  const formRef = useRef<HTMLFormElement>(null);

  const handleCallback = ({ issuer }: { issuer: string }, isValid: boolean) => {
    if (isValid) {
      setIssuer(issuer);
    }
  };

  const handleInputFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
    const { target } = evt;
    setFocused(target.name as Focused);
  };

  const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | undefined = target.value;
    if (target.name === "number") {
      value = formatCreditCardNumber(value);
      setNumber(value || "");
    } else if (target.name === "expiry") {
      value = formatExpirationDate(value);
      setExpiry(value);
    } else if (target.name === "cvc") {
      value = formatCVC(value);
      setCvc(value);
    } else if (target.name === "name") {
      setName(value);
    }

    if (target.name === "number") {
      setNumber(value || "");
    } else if (target.name === "expiry") {
      setExpiry(value || "");
    } else if (target.name === "cvc") {
      setCvc(value || "");
    } else if (target.name === "name") {
      setName(value || "");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = [...e.currentTarget.elements]
      .filter((d: any) => d.name)
      .reduce((acc: any, d: any) => {
        acc[d.name] = d.value;
        return acc;
      }, {});

    setFormData(formData);
    formRef.current?.reset();
  };

  return (
    <div key="Payment">
      <div className="App-payment">
        <Card
          number={number}
          name={name}
          expiry={expiry}
          cvc={cvc}
          focused={focused}
          callback={handleCallback}
        />
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="tel"
              name="number"
              className="form-control"
              placeholder="Card Number"
              pattern="[\d| ]{16,22}"
              required
              value={number}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
            <small>E.g.: 49..., 51..., 36..., 37...</small>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              required
              value={name}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <div className="row">
            <div className="col-6">
              <input
                type="tel"
                name="expiry"
                className="form-control"
                placeholder="Valid Thru"
                pattern="\d\d/\d\d"
                required
                value={expiry}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
            <div className="col-6">
              <input
                type="tel"
                name="cvc"
                className="form-control"
                placeholder="CVC"
                pattern="\d{3,4}"
                required
                value={cvc}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
          </div>
          <input type="hidden" name="issuer" value={issuer} />
          <div className="form-actions">
            <button className="btn btn-primary btn-block">PAY</button>
          </div>
        </form>
        {formData && (
          <div className="App-highlight">
            {formatFormData(formData).map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
