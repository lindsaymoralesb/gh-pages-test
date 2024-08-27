import React, { useState, useRef, useEffect } from "react";
import Card, { Focused } from "react-credit-cards-2";

import "react-credit-cards-2/dist/es/styles-compiled.css"

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
  formatFormData
} from "./utils/payment";

import './App.css';

const App = () => {
  const [number, setNumber] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("");
  const [cvc, setCvc] = useState<string>("");
  const [focused, setFocused] = useState<Focused>("");
  const [issuer, setIssuer] = useState<string>("");
  const [formData, _] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setError(false);
  }, []);

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

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setLoading(true);
    setError(false);

    setTimeout(() => {
      setLoading(false);
      setError(true);
    }, 3000);
  };

  const handleGoBack = () => {
    setError(false);
  };

  return (
    !error ? <>
      <header>
        <img src="/logo_ulatina_1_0.png" alt="logo" className="logo" />
      </header>
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
                placeholder="Número de tarjeta"
                pattern="[\d| ]{16,22}"
                required
                value={number}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Nombre"
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
                  placeholder="Fecha de expiración"
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
            <p className="total">Total a pagar: <span className="number">$4500</span></p>
            <div className="detail">
              <div className="detail-header">
                <span>Cantidad</span>
                <span>Descripción</span>
              </div>
              <div className="detail-content">
                <span>1</span>
                <span>Pagaré Francella R</span>
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary btn-block">
                {loading ? "Procesando..." : "PAGAR"}
              </button>
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
    </> : (
      <>
        <header>
          <img src="/logo_ulatina_1_0.png" alt="logo" className="logo" />
        </header>
        <div className="error">
          <img src="/error.webp" alt="error" className="error-img" />
          <h1>Error en la transacción</h1>
          <p>Por favor, intente nuevamente</p></div>
        <button className="btn btn-primary btn-block" onClick={handleGoBack}>Volver</button>
      </>
    )
  );
};

export default App;
