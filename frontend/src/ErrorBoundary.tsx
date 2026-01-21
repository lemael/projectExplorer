import React, { Component, ErrorInfo, ReactNode } from "react";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Ici, tu peux envoyer l'erreur à un service de log privé (ex: Sentry)
    // mais rien ne s'affiche pour le hacker sur le navigateur
    console.error("Erreur interceptée confidentiellement");
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1>
          Etwas ist schief gelaufen. Bitte versuchen Sie es später erneut.
        </h1>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
