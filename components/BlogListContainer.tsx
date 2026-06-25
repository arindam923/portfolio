"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ArrowUpRight,
  Filter,
  FileText,
  Clock,
  Search,
  X,
} from "lucide-react";
import type { BlogPost } from "@/lib/blogs";

interface BlogListContainerProps {
  posts: BlogPost[];
}

export default function BlogListContainer({ posts }: BlogListContainerProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get all unique tags and their counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((post) => {
      post.tag.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    return counts;
  }, [posts]);

  const allTags = useMemo(() => {
    return Object.keys(tagCounts).sort();
  }, [tagCounts]);

  // Filter tag suggestions based on search query and already selected tags
  const filteredSuggestions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return allTags.filter((tag) => {
      const isAlreadySelected = selectedTags.includes(tag);
      const matchesQuery = tag.toLowerCase().includes(query);
      return !isAlreadySelected && matchesQuery;
    });
  }, [allTags, selectedTags, searchQuery]);

  // Filtered posts based on active tags
  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return posts;
    return posts.filter((post) =>
      selectedTags.every((tag) => post.tag.includes(tag)),
    );
  }, [posts, selectedTags]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredSuggestions.length > 0) {
      e.preventDefault();
      setSelectedTags([...selectedTags, filteredSuggestions[0]]);
      setSearchQuery("");
      setIsDropdownOpen(false);
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 font-mono">
      {/* Redesigned Tag Search Selector */}
      <section className="flex flex-col gap-3 relative" ref={dropdownRef}>
        <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-400 dark:text-zinc-600 px-0.5">
          <div className="flex items-center gap-1.5 select-none">
            <Filter className="w-3.5 h-3.5 text-emerald-500/80" />
            <span>FILTER BY TAGS</span>
          </div>
          {selectedTags.length > 0 && (
            <span className="text-[9px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">
              MATCHING: {filteredPosts.length}
            </span>
          )}
        </div>

        {/* Search Input Box */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex flex-wrap items-center gap-2 p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 focus-within:border-emerald-500/40 dark:focus-within:border-emerald-500/40 focus-within:ring-2 focus-within:ring-emerald-500/10 dark:focus-within:ring-emerald-500/10 transition-all duration-300 min-h-[42px] cursor-text relative"
        >
          <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 ml-1.5 shrink-0" />

          {selectedTags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1 pl-2.5 pr-1 py-0.5 rounded-lg border border-emerald-500/25 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] sm:text-[11px] font-medium select-none shadow-[0_0_10px_rgba(16,185,129,0.02)] transition-all"
            >
              <span>{tag.toUpperCase()}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTags(selectedTags.filter((t) => t !== tag));
                }}
                className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer shrink-0"
              >
                <X size={10} className="stroke-[3]" />
              </button>
            </div>
          ))}

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedTags.length === 0
                ? "Search tags (e.g. react, performance)..."
                : ""
            }
            className="flex-grow min-w-[120px] bg-transparent border-0 outline-none p-1 text-xs sm:text-sm text-foreground placeholder-zinc-400 dark:placeholder-zinc-600 font-mono"
          />

          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTags([]);
                setSearchQuery("");
              }}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors mr-1 cursor-pointer shrink-0"
              title="Clear all filters"
            >
              <X size={14} className="stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Dropdown Options */}
        <AnimatePresence>
          {isDropdownOpen &&
            (filteredSuggestions.length > 0 || searchQuery.trim() !== "") && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden max-h-60 overflow-y-auto"
              >
                <div className="p-1.5 flex flex-col gap-0.5">
                  {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSelectedTags([...selectedTags, tag]);
                          setSearchQuery("");
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-white flex items-center justify-between transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400 dark:text-zinc-600 group-hover:text-emerald-500 transition-colors">
                            #
                          </span>
                          <span className="font-medium">
                            {tag.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded-md group-hover:border-emerald-500/20 group-hover:text-emerald-500 transition-colors">
                          {tagCounts[tag]} post{tagCounts[tag] > 1 ? "s" : ""}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-center text-zinc-400 dark:text-zinc-600 font-mono">
                      No matching tags found
                    </div>
                  )}
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </section>

      {/* Compiled Posts Module List */}
      <section className="flex flex-col gap-6">
        <motion.div layout className="flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((blog, idx) => {
              // Unique deterministic hash for this blog
              let hVal = 0;
              for (let k = 0; k < blog.title.length; k++) {
                hVal = blog.title.charCodeAt(k) + ((hVal << 5) - hVal);
              }
              const hashString = Math.abs(hVal)
                .toString(16)
                .substring(0, 7)
                .padEnd(7, "c");
              const sizeKB = (
                ((blog.title.length + blog.description.length) * 11) / 1024 +
                3.8
              ).toFixed(1);

              return (
                <motion.div
                  key={blog.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  className="group"
                >
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="block bg-zinc-50/50 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-900 rounded-xl p-4 sm:p-5 hover:border-emerald-500/30 dark:hover:border-emerald-500/40 hover:bg-white dark:hover:bg-zinc-950/80 transition-all duration-300 no-underline relative overflow-hidden shadow-sm"
                  >
                    {/* Highlighted active scan line on hover */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Telemetry Bar Header */}
                    <div className="flex items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-3 mb-4 font-mono text-[9px] sm:text-[10px] text-zinc-400 dark:text-zinc-500 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 group-hover:text-emerald-500 transition-colors shrink-0" />
                        <span className="font-semibold text-zinc-600 dark:text-zinc-400 tracking-wider truncate min-w-0 text-[9px] sm:text-[10px]">
                          ~/blogs/{blog.slug}.mdx
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden sm:inline bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded">
                          HASH: {hashString}
                        </span>
                        <span className="hidden sm:inline bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded">
                          {sizeKB} KB
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-base sm:text-lg font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug font-sans tracking-tight">
                          {blog.title}
                        </h3>
                        <div className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-600 group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:border-emerald-500/20 transition-all shrink-0">
                          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl font-sans mt-1">
                        {blog.description}
                      </p>

                      {/* Module status bar footer */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-zinc-200 dark:border-zinc-900/60 pt-3.5 mt-3 text-[10px]">
                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5 max-w-full">
                          {blog.tag.map((tag: string) => (
                            <span
                              key={tag}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!selectedTags.includes(tag)) {
                                  setSelectedTags([...selectedTags, tag]);
                                }
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] sm:text-[10px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/80 rounded uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/10 select-none cursor-pointer"
                            >
                              <span className="text-emerald-600 dark:text-emerald-500/50 font-bold">
                                #
                              </span>
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Read time and date */}
                        <div className="flex items-center gap-3 sm:gap-4 text-zinc-400 dark:text-zinc-500 font-mono text-[9px] sm:text-[10px] shrink-0 mt-0.5 sm:mt-0">
                          <span className="flex items-center gap-1 shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
                            {blog.date}
                          </span>
                          <span className="flex items-center gap-1 shrink-0">
                            <Clock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600 shrink-0" />
                            {blog.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
