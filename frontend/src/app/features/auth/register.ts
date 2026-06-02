/* Barre de drapeaux */
.flag-lang-container {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}
.flag-btn {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 0.4rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.15s ease;
}
.flag-btn.active {
  background-color: #00A86B;
  color: #ffffff;
  border-color: #00A86B;
}
.flag-icon {
  font-size: 1rem;
}

/* Zone Démo d'urgence */
.demo-routing-box {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 0.5rem;
  text-align: center;
}
.demo-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #64748b;
  margin: 0 0 0.75rem 0;
}
.demo-buttons-row {
  display: flex;
  gap: 0.5rem;
}
.btn-demo-bypass {
  flex: 1;
  border: none;
  padding: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 0.25rem;
  cursor: pointer;
  color: white;
}
.btn-demo-bypass.admin { background-color: #475569; }
.btn-demo-bypass.passager { background-color: #0284c7; }
