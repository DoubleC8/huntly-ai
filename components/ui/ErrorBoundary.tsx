"use client";

import { RefreshCw, ServerCrash } from "lucide-react";
import React, { Component, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter } from "./card";
import Link from "next/link";
import { Button } from "./button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Resume section crashed: ", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="pageContainer justify-center">
            <Card className="lg:w-6/10 bg-[var(--background)] w-[95%] mx-auto">
              <CardContent className="flex flex-col items-center gap-3">
                <ServerCrash className="text-[var(--app-blue)]" />
                <p>Oops! Something went wrong.</p>
                <CardDescription className="text-center">
                  We’re working on it. Please try again later.
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Link href="/jobs/dashboard" className="w-1/2 mx-auto">
                  <Button className="w-full">
                    Refresh <RefreshCw />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
