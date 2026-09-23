"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiTestSchema, ApiTestFormValues } from "@/lib/validators/api.validator";
import { runApiTest, ApiTestResult } from "@/lib/testing/apiTester";
import { Plus, Trash2, Send, Clock, Activity, FileJson, CheckCircle2, XCircle } from "lucide-react";

type Tab = "headers" | "params" | "body" | "auth";
type RightTab = "body" | "headers" | "schema";

export default function ApiTestingPage() {
  const [result, setResult] = useState<ApiTestResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("headers");
  const [rightTab, setRightTab] = useState<RightTab>("body");

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<ApiTestFormValues>({
    resolver: zodResolver(apiTestSchema),
    defaultValues: {
      url: "http://localhost:3000/api/articles",
      method: "GET",
      headers: [
        { key: "Content-Type", value: "application/json" },
        { key: "Authorization", value: "Bearer {token}" },
      ],
      body: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "headers" });
  const method = watch("method");

  const onSubmit = async (data: ApiTestFormValues) => {
    setIsTesting(true);
    setResult(null);
    try {
      const res = await runApiTest(data);
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTesting(false);
    }
  };

  const tabs: Tab[] = ["headers", "params", "body", "auth"];
  const rightTabs: RightTab[] = ["body", "headers", "schema"];

  const isSuccess = result && result.status >= 200 && result.status < 300;
  const isError   = result && (result.status === 0 || result.status >= 400);

  const validations = [
    { label: "Validate Schema",         pass: !!result && !result.error },
    { label: "Validate Response Body",  pass: !!result && !!result.body },
    { label: "Check Response Time",     pass: !!result && (result.durationMs ?? 0) < 1000 },
  ];

  function tabStyle(active: boolean) {
    return {
      padding: "6px 14px",
      fontSize: 12,
      fontWeight: active ? 600 : 400,
      color: active ? "var(--accent)" : "var(--text-muted)",
      cursor: "pointer",
      background: "none",
      border: "none",
      borderBottom: active ? `2px solid var(--accent)` : "2px solid transparent",
    } as React.CSSProperties;
  }

  return (
    <div className="p-6 max-w-[1400px] space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>API Testing</h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Test and validate your REST APIs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* REQUEST PANEL */}
        <div className="card flex flex-col overflow-hidden" style={{ height: 560 }}>
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderBottom: "1px solid #1E3A5F", background: "#13253B" }}
          >
            <span className="text-xs font-semibold" style={{ color: "#E2F1FF" }}>Request</span>
            <span className="flex-1" />
            <span className="text-xs" style={{ color: "#88A4C4" }}>Response</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            {/* URL Bar */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: "1px solid var(--card-border)" }}
            >
              <select
                {...register("method")}
                className="text-xs font-bold rounded px-2 py-1.5"
                style={{ border: "1px solid #1E3A5F", color: "#E2F1FF", background: "#13253B", width: 85 }}
              >
                {["GET", "POST", "PUT", "PATCH", "DELETE"].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input
                {...register("url")}
                className="flex-1 text-xs font-mono rounded px-2 py-1.5"
                style={{ border: "1px solid var(--card-border)", outline: "none", color: "var(--text-primary)" }}
                placeholder="https://api.example.com/v1/resource"
              />
              <button
                type="submit"
                disabled={isTesting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white disabled:opacity-50"
                style={{ background: "var(--accent)" }}
              >
                <Send size={12} />
                {isTesting ? "Sending..." : "Send"}
              </button>
            </div>

            {/* Sub-tabs */}
            <div
              className="flex"
              style={{ borderBottom: "1px solid var(--card-border)", paddingLeft: 16 }}
            >
              {tabs.map(t => (
                <button key={t} type="button" onClick={() => setActiveTab(t)} style={tabStyle(activeTab === t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "headers" && (
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center">
                      <input
                        {...register(`headers.${index}.key` as const)}
                        placeholder="Key"
                        className="w-1/3 text-xs px-2 py-1.5 rounded font-mono"
                        style={{ border: "1px solid var(--card-border)", outline: "none" }}
                      />
                      <input
                        {...register(`headers.${index}.value` as const)}
                        placeholder="Value"
                        className="flex-1 text-xs px-2 py-1.5 rounded font-mono"
                        style={{ border: "1px solid var(--card-border)", outline: "none" }}
                      />
                      <button type="button" onClick={() => remove(index)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => append({ key: "", value: "" })}
                    className="flex items-center gap-1 text-xs mt-2"
                    style={{ color: "var(--accent)" }}
                  >
                    <Plus size={12} /> Add Header
                  </button>
                </div>
              )}

              {activeTab === "body" && method !== "GET" && method !== "DELETE" && (
                <textarea
                  {...register("body")}
                  rows={10}
                  className="w-full text-xs font-mono rounded px-3 py-2"
                  style={{ border: "1px solid var(--card-border)", outline: "none", resize: "vertical" }}
                  placeholder={`{\n  "key": "value"\n}`}
                />
              )}

              {activeTab === "params" && (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Query params will be appended to the URL.</p>
              )}

              {activeTab === "auth" && (
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Set Authorization header above or paste a Bearer token.</p>
              )}
            </div>
          </form>
        </div>

        {/* RESPONSE PANEL */}
        <div className="card flex flex-col overflow-hidden" style={{ height: 560 }}>
          {/* Response header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: "1px solid #1E3A5F", background: "#13253B" }}
          >
            <span className="text-xs font-semibold" style={{ color: "#E2F1FF" }}>Response</span>
            {result && (
              <div className="flex items-center gap-3 ml-2">
                <span
                  className="flex items-center gap-1 text-xs font-semibold"
                  style={{ color: isSuccess ? "#16a34a" : "#dc2626" }}
                >
                  <Activity size={12} />
                  {result.status === 0 ? "Error" : `${result.status} ${result.statusText}`}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  <Clock size={12} />
                  {result.durationMs}ms
                </span>
              </div>
            )}
          </div>

          {/* Right tabs */}
          <div
            className="flex"
            style={{ borderBottom: "1px solid var(--card-border)", paddingLeft: 16 }}
          >
            {rightTabs.map(t => (
              <button key={t} type="button" onClick={() => setRightTab(t)} style={tabStyle(rightTab === t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Code area */}
          <div
            className="flex-1 overflow-auto p-4"
            style={{ background: "#13253B", fontFamily: "monospace" }}
          >
            {!result && !isTesting && (
              <div className="h-full flex flex-col items-center justify-center gap-2" style={{ color: "#88A4C4" }}>
                <FileJson size={28} />
                <p className="text-xs">Send a request to see the response here</p>
              </div>
            )}
            {isTesting && (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-7 w-7 border-2 border-blue-500 border-t-transparent" />
              </div>
            )}
            {result && (
              <pre className="text-xs whitespace-pre-wrap break-all" style={{ color: "#a9b7d0" }}>
                {result.error
                  ? `Error: ${result.error}`
                  : typeof result.body === "object"
                    ? JSON.stringify(result.body, null, 2)
                    : String(result.body)}
              </pre>
            )}
          </div>

          {/* Validation checks */}
          <div
            className="px-4 py-3 space-y-1.5"
            style={{ borderTop: "1px solid var(--card-border)" }}
          >
            {validations.map((v) => (
              <div key={v.label} className="flex items-center gap-2 text-xs">
                {result
                  ? v.pass
                    ? <CheckCircle2 size={13} className="text-green-500" />
                    : <XCircle size={13} className="text-red-400" />
                  : <span className="w-3 h-3 rounded-full border border-gray-300 inline-block" />
                }
                <span style={{ color: "var(--text-secondary)" }}>{v.label}</span>
                {result && (
                  <span
                    className="ml-auto text-[10px] font-semibold"
                    style={{ color: v.pass ? "#16a34a" : "#dc2626" }}
                  >
                    {v.pass ? "Pass" : "Fail"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
