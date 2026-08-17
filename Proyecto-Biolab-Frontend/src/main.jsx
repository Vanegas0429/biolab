import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

import { BrowserRouter } from 'react-router-dom'

// ============================================================
// Fix: Google Translate rompe React al mover nodos del DOM.
// Parcheamos removeChild e insertBefore para que no exploten
// cuando el nodo ya fue movido por el traductor de Chrome.
// ============================================================
if (typeof Node !== 'undefined') {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function(child) {
    if (child.parentNode !== this) {
      console.warn('[GoogleTranslate patch] removeChild: el nodo no es hijo directo, ignorando.');
      return child;
    }
    return originalRemoveChild.call(this, child);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      console.warn('[GoogleTranslate patch] insertBefore: referenceNode no es hijo directo, ignorando.');
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>,
)

