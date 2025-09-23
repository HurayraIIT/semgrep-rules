import React, { useEffect, useState, useMemo, useCallback } from "react";

interface ApiConfig {
  endpoint: string;
  timeout?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

// Test Case 1: TypeScript version of Cloudflare-style bug
function TypeScriptDashboard(): JSX.Element {
  const [data, setData] = useState<any>(null);
  const config: ApiConfig = { endpoint: "/api/tenant", timeout: 5000 };

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    fetchData(config);
  }, [config]);

  return <div>{data}</div>;
}

// Test Case 2: Generic type with object dependency
function GenericComponent<T>({ initialValue }: { initialValue: T }): JSX.Element {
  const [value, setValue] = useState<T>(initialValue);
  const options: { cache: boolean; retry: number } = { cache: false, retry: 3 };

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    processValue(value, options);
  }, [value, options]);

  return <div>Processed</div>;
}

// Test Case 3: Interface-typed object dependency
interface RequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers: Record<string, string>;
  timeout: number;
}

function ApiComponent({ userId }: { userId: string }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const requestConfig: RequestConfig = {
    method: "GET",
    headers: { Authorization: `Bearer ${userId}` },
    timeout: 10000,
  };

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    fetchUser(requestConfig);
  }, [requestConfig]);

  return <div>{user?.name}</div>;
}

// Safe: useMemo with TypeScript
function SafeTypedComponent({ apiKey }: { apiKey: string }): JSX.Element {
  const [data, setData] = useState<any>(null);

  const config: ApiConfig = useMemo(
    () => ({
      endpoint: "/api/data",
      timeout: 5000,
    }),
    [apiKey]
  );

  // ok: react-useeffect-object-dependency
  useEffect(() => {
    fetchData(config);
  }, [config]);

  return <div>{data}</div>;
}

// Safe: Primitive dependencies with TypeScript
function SafeTypedComponent2({ userId, isActive }: { userId: string; isActive: boolean }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);

  // ok: react-useeffect-object-dependency
  useEffect(() => {
    fetchUser(userId, isActive);
  }, [userId, isActive]);

  return <div>{user?.name}</div>;
}

// Test Case 4: Class component style (converted to function)
interface ComponentState {
  loading: boolean;
  error: string | null;
}

function ClassStyleComponent(): JSX.Element {
  const [state, setState] = useState<ComponentState>({ loading: false, error: null });
  const defaultState: ComponentState = { loading: false, error: null };

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    setState(defaultState);
  }, [defaultState]);

  return <div>Loading: {state.loading}</div>;
}

// Test Case 5: Complex nested TypeScript interfaces
interface AnalyticsFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  metrics: string[];
  groupBy: "day" | "week" | "month";
}

function AnalyticsComponent(): JSX.Element {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const filters: AnalyticsFilters = {
    dateRange: {
      start: new Date("2025-01-01"),
      end: new Date("2025-01-31"),
    },
    metrics: ["pageviews", "sessions", "bounceRate"],
    groupBy: "day",
  };

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    fetchAnalytics(filters);
  }, [filters]);

  return <div>Analytics: {analytics.length} records</div>;
}

declare function fetchData(config: any): void;
declare function processValue<T>(value: T, options: any): void;
declare function fetchUser(config: any): void;
declare function fetchUser(userId: string, isActive: boolean): void;
declare function fetchAnalytics(filters: any): void;
