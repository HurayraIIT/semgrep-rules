import React, { useEffect, useState, useMemo, useCallback } from "react";

// Test Case 1: Classic Cloudflare-style bug - object literal in component
function Dashboard() {
  const [data, setData] = useState(null);
  const config = { endpoint: "/api/tenant" };

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    fetchData(config);
  }, [config]);

  return <div>{data}</div>;
}

// Test Case 2: Direct object literal in dependency array
function Component2() {
  const [state, setState] = useState(null);

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    doSomething();
  }, [{ key: "value" }]);

  return <div>{state}</div>;
}

// Test Case 3: Multiple object dependencies
function Component3({ userId }) {
  const [user, setUser] = useState(null);
  const apiConfig = { baseUrl: "https://api.example.com", timeout: 5000 };
  const headers = { "Content-Type": "application/json" };

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    fetchUser(userId, apiConfig, headers);
  }, [userId, apiConfig, headers]);

  return <div>{user?.name}</div>;
}

// Test Case 4: WordPress plugin style - settings object
function WordPressPlugin() {
  const [settings, setSettings] = useState({});
  const pluginConfig = {
    version: "1.0.0",
    apiEndpoint: "/wp-json/myplugin/v1",
    nonce: window.wpNonce,
  };

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    loadPluginSettings(pluginConfig);
  }, [pluginConfig]);

  return <div>Plugin loaded</div>;
}

// Test Case 5: SaaS dashboard with filters
function SaaSAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const filters = {
    dateRange: "30d",
    metrics: ["pageviews", "sessions"],
    groupBy: "day",
  };

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    fetchAnalytics(filters);
  }, [filters]);

  return <div>Analytics Dashboard</div>;
}

// Test Case 6: Arrow function component
const ArrowComponent = () => {
  const [data, setData] = useState(null);
  const options = { cache: false, retry: 3 };

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    loadData(options);
  }, [options]);

  return <div>{data}</div>;
};

// Test Case 7: Object.assign usage
function Component7() {
  const [state, setState] = useState({});
  const config = Object.assign({}, { a: 1, b: 2 });

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    processConfig(config);
  }, [config]);

  return <div>Component 7</div>;
}

// Test Case 8: Array dependency (also problematic)
function Component8() {
  const [items, setItems] = useState([]);
  const defaultItems = ["item1", "item2", "item3"];

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    setItems(defaultItems);
  }, [defaultItems]);

  return <div>{items.length} items</div>;
}

// Test Case 9: Nested object creation
function Component9({ apiKey }) {
  const [response, setResponse] = useState(null);

  const requestConfig = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    timeout: 10000,
  };

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    makeRequest(requestConfig);
  }, [requestConfig]);

  return <div>Response: {response}</div>;
}

// Test Case 10: Function component with complex object
function ComplexDashboard({ userId, tenantId }) {
  const [dashboardData, setDashboardData] = useState(null);

  const queryParams = {
    user: userId,
    tenant: tenantId,
    include: ["metrics", "alerts", "reports"],
    format: "json",
    version: "v2",
  };

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    fetchDashboardData(queryParams);
  }, [queryParams]);

  return <div>Dashboard for {userId}</div>;
}

// Test Case 11: React component with state-dependent object
function Component11() {
  const [currentUser, setCurrentUser] = useState(null);
  const [permissions, setPermissions] = useState([]);

  const userContext = {
    user: currentUser,
    permissions: permissions,
    timestamp: Date.now(),
  };

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    updateUserContext(userContext);
  }, [userContext]);

  return <div>User Context</div>;
}

// Test Case 12: E-commerce component
function ProductList({ categoryId }) {
  const [products, setProducts] = useState([]);
  const searchParams = {
    category: categoryId,
    sortBy: "price",
    order: "asc",
    limit: 20,
    includeOutOfStock: false,
  };

  // ruleid: react-useeffect-object-dependency
  useEffect(() => {
    searchProducts(searchParams);
  }, [searchParams]);

  return <div>{products.length} products</div>;
}

// ===== SAFE PATTERNS (should NOT trigger the rule) =====

// Safe: Empty dependency array
function SafeComponent1() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // ok: react-useeffect-object-dependency
    fetchInitialData();
  }, []);

  return <div>{data}</div>;
}

// Safe: Primitive dependencies only
function SafeComponent2({ userId, isActive }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ok: react-useeffect-object-dependency
    fetchUser(userId, isActive);
  }, [userId, isActive]);

  return <div>{user?.name}</div>;
}

// Safe: useMemo for object dependency
function SafeComponent3({ apiKey }) {
  const [data, setData] = useState(null);

  // ok: react-useeffect-object-dependency
  const config = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 5000,
    }),
    [apiKey]
  );

  useEffect(() => {
    fetchData(config);
  }, [config]);

  return <div>{data}</div>;
}

// Safe: useCallback for function dependency
function SafeComponent4({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  // ok: react-useeffect-object-dependency
  const handleSuccess = useCallback(
    (data) => {
      setLoading(false);
      onSuccess(data);
    },
    [onSuccess]
  );

  useEffect(() => {
    performAsyncOperation(handleSuccess);
  }, [handleSuccess]);

  return <div>Loading: {loading}</div>;
}

// Safe: Object created inside useEffect
function SafeComponent5({ endpoint }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    // ok: react-useeffect-object-dependency
    const config = {
      url: endpoint,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    fetchData(config);
  }, [endpoint]);

  return <div>{data}</div>;
}

// Safe: Object defined outside component
const GLOBAL_CONFIG = {
  apiVersion: "v1",
  timeout: 10000,
  retries: 3,
};

function SafeComponent6() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    // ok: react-useeffect-object-dependency
    makeApiCall(GLOBAL_CONFIG);
  }, []);

  return <div>{result}</div>;
}

// Safe: No dependency array (runs on every render, but intentional)
function SafeComponent7() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // ok: react-useeffect-object-dependency
    console.log("Component rendered");
  });

  return <div>Count: {count}</div>;
}

// Safe: String/number dependencies only
function SafeComponent8({ url, timeout, retryCount }) {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    // ok: react-useeffect-object-dependency
    fetchWithRetry(url, timeout, retryCount);
  }, [url, timeout, retryCount]);

  return <div>Response: {response}</div>;
}

// Safe: Memoized complex object
function SafeComponent9({ filters, sortOptions }) {
  const [data, setData] = useState([]);

  // ok: react-useeffect-object-dependency
  const queryConfig = useMemo(
    () => ({
      filters: filters,
      sort: sortOptions,
      pagination: { page: 1, limit: 50 },
    }),
    [filters, sortOptions]
  );

  useEffect(() => {
    fetchData(queryConfig);
  }, [queryConfig]);

  return <div>{data.length} items</div>;
}
