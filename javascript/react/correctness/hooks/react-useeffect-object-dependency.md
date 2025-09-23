# React useEffect Object Dependency Rule

## Overview

This rule detects a critical React useEffect pattern that caused the Cloudflare outage on September 12, 2025. The rule identifies when objects are created inline within React components and used as dependencies in useEffect hooks, which causes infinite re-renders and can lead to API overload.

## The Cloudflare Incident

On September 12, 2025, Cloudflare experienced a major outage that lasted over an hour, affecting their dashboard and many APIs. The root cause was a React useEffect hook with an object dependency that was recreated on every render:

```javascript
function Dashboard() {
  const config = { endpoint: '/api/tenant' }; // New object every render!

  useEffect(() => {
    fetchData(config);
  }, [config]); // This runs every single render
}
```

This created a cascade failure:
1. Component renders → creates new config object
2. useEffect sees "new" dependency → calls API
3. API response updates state → triggers re-render
4. Go to step 1 (infinite loop)

The excessive API calls overwhelmed Cloudflare's Tenant Service, causing the outage.

## Why This Happens

React uses `Object.is()` to compare dependencies in useEffect. For objects:
- `Object.is({a: 1}, {a: 1})` returns `false` (different references)
- Even identical object contents are treated as "new" dependencies
- This triggers the effect on every render

## Vulnerable Patterns Detected

### 1. Object Literal in Component
```javascript
function Component() {
  const config = { endpoint: '/api/data' }; // ❌ Recreated every render
  
  useEffect(() => {
    fetchData(config);
  }, [config]);
}
```

### 2. Direct Object in Dependency Array
```javascript
function Component() {
  useEffect(() => {
    doSomething();
  }, [{ key: 'value' }]); // ❌ New object every render
}
```

### 3. Object.assign Usage
```javascript
function Component() {
  const config = Object.assign({}, defaultConfig); // ❌ New object every render
  
  useEffect(() => {
    processConfig(config);
  }, [config]);
}
```

## Safe Patterns (Not Flagged)

### 1. useMemo for Object Dependencies
```javascript
function Component({ apiKey }) {
  const config = useMemo(() => ({
    headers: { 'Authorization': `Bearer ${apiKey}` },
    timeout: 5000
  }), [apiKey]); // ✅ Memoized, only changes when apiKey changes
  
  useEffect(() => {
    fetchData(config);
  }, [config]);
}
```

### 2. Primitive Dependencies Only
```javascript
function Component({ userId, isActive }) {
  useEffect(() => {
    fetchUser(userId, isActive); // ✅ Primitives compare by value
  }, [userId, isActive]);
}
```

### 3. Object Created Inside useEffect
```javascript
function Component({ endpoint }) {
  useEffect(() => {
    const config = { // ✅ Created inside effect
      url: endpoint,
      method: 'GET'
    };
    fetchData(config);
  }, [endpoint]);
}
```

### 4. Object Defined Outside Component
```javascript
const GLOBAL_CONFIG = { // ✅ Constant reference
  apiVersion: 'v1',
  timeout: 10000
};

function Component() {
  useEffect(() => {
    makeApiCall(GLOBAL_CONFIG);
  }, []);
}
```

## How to Fix

When this rule triggers, consider these solutions:

1. **Move object creation inside useEffect**:
   ```javascript
   useEffect(() => {
     const config = { endpoint: '/api/data' };
     fetchData(config);
   }, []);
   ```

2. **Use useMemo to memoize the object**:
   ```javascript
   const config = useMemo(() => ({ endpoint: '/api/data' }), []);
   ```

3. **Use primitive values as dependencies**:
   ```javascript
   const endpoint = '/api/data';
   useEffect(() => {
     fetchData({ endpoint });
   }, [endpoint]);
   ```

4. **Move constant objects outside the component**:
   ```javascript
   const CONFIG = { endpoint: '/api/data' };
   // Use CONFIG in useEffect
   ```

## Impact

This vulnerability can cause:
- Infinite re-render loops
- Performance degradation
- API overload and service outages
- Poor user experience
- Server crashes (as seen with Cloudflare)

## References

- [Cloudflare Outage Post-Mortem](https://blog.cloudflare.com/deep-dive-into-cloudflares-sept-12-dashboard-and-api-outage/)
- [Technical Analysis](https://sngeth.com/react/debugging/2025/09/14/cloudflare-useeffect-outage/)
- [React useEffect Documentation](https://react.dev/reference/react/useEffect)
- [Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies)
