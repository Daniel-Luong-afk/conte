"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { trpc } from "../lib/trpc";

type NovelForm = {
  title_original: string;
  title_english: string;
  description: string;
  cover_url: string;
  status: "ONGOING" | "COMPLETED" | "HIATUS";
  language: "JP" | "KR" | "CN";
};

const emptyForm: NovelForm = {
  title_original: "",
  title_english: "",
  description: "",
  cover_url: "",
  status: "ONGOING",
  language: "JP",
};

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      <input
        className="border border-gray-700 rounded px-3 py-2 w-full bg-transparent text-sm"
        placeholder={placeholder ?? label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { data: me, isLoading: meLoading } = trpc.users.getMe.useQuery();
  const { data: novels, isLoading: novelsLoading } =
    trpc.novels.getAll.useQuery(undefined, { initialData: [] });

  const utils = trpc.useUtils();

  function afterMutation() {
    utils.novels.getAll.invalidate();
    router.refresh();
  }

  const scrapeMutation = trpc.scraper.scrapNovel.useMutation();
  const createNovel = trpc.novels.create.useMutation({
    onSuccess: afterMutation,
  });
  const updateNovel = trpc.novels.update.useMutation({
    onSuccess: afterMutation,
  });
  const deleteNovel = trpc.novels.delete.useMutation({
    onSuccess: afterMutation,
  });
  const addSource = trpc.novels.addSource.useMutation({
    onSuccess: afterMutation,
  });
  const updateSource = trpc.novels.updateSource.useMutation({
    onSuccess: afterMutation,
  });
  const deleteSource = trpc.novels.deleteSource.useMutation({
    onSuccess: afterMutation,
  });

  const [createForm, setCreateForm] = useState<NovelForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<NovelForm>>({});
  const [sourceInputs, setSourceInputs] = useState<
    Record<string, { site_name: string; source_url: string }>
  >({});
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);
  const [editSourceForm, setEditSourceForm] = useState({
    site_name: "",
    source_url: "",
  });

  useEffect(() => {
    if (!meLoading && me?.role !== "ADMIN") router.replace("/");
  }, [me, meLoading, router]);

  if (meLoading || novelsLoading)
    return <p className="p-8 text-gray-400">Loading...</p>;
  if (me?.role !== "ADMIN") return null;

  function handleEditClick(novel: any) {
    setEditingId(novel.id);
    setEditForm({
      title_original: novel.title_original ?? "",
      title_english: novel.title_english ?? "",
      description: novel.description ?? "",
      cover_url: novel.cover_url ?? "",
      status: novel.status ?? "ONGOING",
    });
  }

  function handleEditCancel() {
    setEditingId(null);
    setEditForm({});
  }

  function getSourceInput(novelId: string) {
    return sourceInputs[novelId] ?? { site_name: "", source_url: "" };
  }

  function setSourceInput(
    novelId: string,
    field: "site_name" | "source_url",
    value: string,
  ) {
    setSourceInputs((prev) => ({
      ...prev,
      [novelId]: { ...getSourceInput(novelId), [field]: value },
    }));
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      {/* ── Create Novel ── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Create Novel</h2>
        <Field
          label="Title (Original)"
          value={createForm.title_original}
          onChange={(v) => setCreateForm({ ...createForm, title_original: v })}
        />
        <Field
          label="Title (English)"
          value={createForm.title_english}
          onChange={(v) => setCreateForm({ ...createForm, title_english: v })}
        />
        <Field
          label="Description"
          value={createForm.description}
          onChange={(v) => setCreateForm({ ...createForm, description: v })}
        />
        <Field
          label="Cover URL"
          value={createForm.cover_url}
          placeholder="https://..."
          onChange={(v) => setCreateForm({ ...createForm, cover_url: v })}
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">
            Language
          </label>
          <select
            className="border border-gray-700 rounded px-3 py-2 w-full bg-gray-900 text-sm"
            value={createForm.language}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                language: e.target.value as "JP" | "KR" | "CN",
              })
            }
          >
            <option value="JP">Japanese</option>
            <option value="KR">Korean</option>
            <option value="CN">Chinese</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400 uppercase tracking-wide">
            Status
          </label>
          <select
            className="border border-gray-700 rounded px-3 py-2 w-full bg-gray-900 text-sm"
            value={createForm.status}
            onChange={(e) =>
              setCreateForm({
                ...createForm,
                status: e.target.value as "ONGOING" | "COMPLETED" | "HIATUS",
              })
            }
          >
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="HIATUS">Hiatus</option>
          </select>
        </div>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          onClick={() =>
            createNovel.mutate(createForm, {
              onSuccess: () => setCreateForm(emptyForm),
            })
          }
        >
          Create Novel
        </button>
        {createNovel.isError && (
          <p className="text-red-500 text-sm">{createNovel.error.message}</p>
        )}
      </section>

      {/* ── Novel List ── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">All Novels</h2>
        {(novels as any[]).map((novel: any) => (
          <div
            key={novel.id}
            className="border border-gray-700 rounded-lg p-4 space-y-4"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">
                  {novel.title_english ?? novel.title_original}
                </p>
                <p className="text-xs text-gray-400">
                  {novel.language} · {novel.status}
                </p>
                {novel.cover_url && (
                  <img
                    src={novel.cover_url}
                    alt="cover"
                    className="mt-2 h-20 rounded object-cover"
                  />
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-xs"
                  onClick={() => handleEditClick(novel)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  onClick={() => deleteNovel.mutate({ id: novel.id })}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Edit form */}
            {editingId === novel.id && (
              <div className="space-y-3 border-t border-gray-700 pt-4">
                <Field
                  label="Title (Original)"
                  value={editForm.title_original ?? ""}
                  onChange={(v) =>
                    setEditForm({ ...editForm, title_original: v })
                  }
                />
                <Field
                  label="Title (English)"
                  value={editForm.title_english ?? ""}
                  onChange={(v) =>
                    setEditForm({ ...editForm, title_english: v })
                  }
                />
                <Field
                  label="Description"
                  value={editForm.description ?? ""}
                  onChange={(v) => setEditForm({ ...editForm, description: v })}
                />
                <Field
                  label="Cover URL"
                  value={editForm.cover_url ?? ""}
                  placeholder="https://..."
                  onChange={(v) => setEditForm({ ...editForm, cover_url: v })}
                />
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400 uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    className="border border-gray-700 rounded px-3 py-2 w-full bg-gray-900 text-sm"
                    value={editForm.status ?? "ONGOING"}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        status: e.target.value as
                          | "ONGOING"
                          | "COMPLETED"
                          | "HIATUS",
                      })
                    }
                  >
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="HIATUS">Hiatus</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
                    onClick={() =>
                      updateNovel.mutate(
                        { id: novel.id, ...editForm },
                        { onSuccess: handleEditCancel },
                      )
                    }
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Source URLs */}
            <div className="border-t border-gray-700 pt-4 space-y-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Source URL
              </p>

              {novel.sources?.length > 0 ? (
                novel.sources.map((s: any) => (
                  <div key={s.id} className="space-y-2">
                    {editingSourceId === s.id ? (
                      <div className="space-y-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-gray-400">
                            Site Name
                          </label>
                          <input
                            className="border border-gray-700 rounded px-3 py-1 bg-transparent text-xs w-full"
                            value={editSourceForm.site_name}
                            onChange={(e) =>
                              setEditSourceForm({
                                ...editSourceForm,
                                site_name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-gray-400">
                            Source URL
                          </label>
                          <input
                            className="border border-gray-700 rounded px-3 py-1 bg-transparent text-xs w-full"
                            value={editSourceForm.source_url}
                            onChange={(e) =>
                              setEditSourceForm({
                                ...editSourceForm,
                                source_url: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs"
                            onClick={() =>
                              updateSource.mutate(
                                { id: s.id, ...editSourceForm },
                                { onSuccess: () => setEditingSourceId(null) },
                              )
                            }
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs"
                            onClick={() => setEditingSourceId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-800 rounded px-3 py-2">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-300">
                            {s.site_name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {s.source_url}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-2 shrink-0">
                          <button
                            className="text-xs text-indigo-400 hover:text-indigo-300"
                            onClick={() => {
                              setEditingSourceId(s.id);
                              setEditSourceForm({
                                site_name: s.site_name,
                                source_url: s.source_url,
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="text-xs text-red-400 hover:text-red-300"
                            onClick={() => deleteSource.mutate({ id: s.id })}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 italic">
                    No source URL yet
                  </p>
                  <div className="flex gap-2">
                    <input
                      className="border border-gray-700 rounded px-3 py-1 bg-transparent text-xs w-28 shrink-0"
                      placeholder="Site name"
                      value={getSourceInput(novel.id).site_name}
                      onChange={(e) =>
                        setSourceInput(novel.id, "site_name", e.target.value)
                      }
                    />
                    <input
                      className="border border-gray-700 rounded px-3 py-1 bg-transparent text-xs flex-1"
                      placeholder="https://..."
                      value={getSourceInput(novel.id).source_url}
                      onChange={(e) =>
                        setSourceInput(novel.id, "source_url", e.target.value)
                      }
                    />
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs shrink-0"
                      onClick={() =>
                        addSource.mutate({
                          novel_id: novel.id,
                          ...getSourceInput(novel.id),
                        })
                      }
                    >
                      Add
                    </button>
                  </div>
                  {addSource.isError && (
                    <p className="text-red-500 text-xs">
                      {addSource.error.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Scraper */}
            <div className="border-t border-gray-700 pt-4">
              <button
                onClick={() => scrapeMutation.mutate({ novel_id: novel.id })}
                disabled={scrapeMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs px-4 py-2 rounded"
              >
                {scrapeMutation.isPending ? "Scraping..." : "Scrape"}
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
