"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, FileText, FolderOpen, GraduationCap, Search } from "lucide-react";
import { InstallApp } from "./InstallApp";
import { ThemeToggle } from "./ThemeToggle";

const CATEGORIES = ["notes", "formulas", "pyq"] as const;
const PAGE_SIZE = 24;

export type Resource = {
  id: string;
  title: string;
  grade: string;
  subject: string;
  category: (typeof CATEGORIES)[number];
  path: string;
  relativePath: string;
  order: number;
};

type Category = Resource["category"];

const categoryLabels: Record<Category, string> = { notes: "Notes", formulas: "Formulas", pyq: "PYQs" };
const categoryDescriptions: Record<Category, string> = {
  notes: "Concept notes, explanations, and interactive study material.",
  formulas: "Formula sheets and quick-reference revision material.",
  pyq: "Previous-year questions, papers, and worked solutions.",
};

function labelFromFolder(folderName: string) {
  return folderName
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function AtlasWorkspace({ resources }: { resources: Resource[] }) {
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const grades = useMemo(() => [...new Set(resources.map((resource) => resource.grade))].sort(), [resources]);
  const subjects = useMemo(
    () => [...new Set(resources.filter((resource) => resource.grade === selectedGrade).map((resource) => resource.subject))].sort(),
    [resources, selectedGrade],
  );

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesGrade = !selectedGrade || resource.grade === selectedGrade;
      const matchesSubject = !selectedSubject || resource.subject === selectedSubject;
      const matchesCategory = !selectedCategory || resource.category === selectedCategory;
      const matchesQuery = !normalizedQuery || [resource.title, resource.relativePath, resource.grade, resource.subject, categoryLabels[resource.category]]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      return matchesGrade && matchesSubject && matchesCategory && matchesQuery;
    });
  }, [query, resources, selectedCategory, selectedGrade, selectedSubject]);

  const totalPages = Math.max(1, Math.ceil(filteredResources.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageResources = filteredResources.slice(pageStart, pageStart + PAGE_SIZE);
  const isSearching = query.trim().length > 0;
  const isDocumentView = isSearching || selectedCategory !== null;

  const resetPage = () => setPage(1);
  const updateSearch = (value: string) => { setQuery(value); resetPage(); };
  const chooseGrade = (grade: string) => { setSelectedGrade(grade); setSelectedSubject(null); setSelectedCategory(null); setQuery(""); resetPage(); };
  const chooseSubject = (subject: string) => { setSelectedSubject(subject); setSelectedCategory(null); setQuery(""); resetPage(); };
  const chooseCategory = (category: Category) => { setSelectedCategory(category); setQuery(""); resetPage(); };
  const goBack = () => {
    if (selectedCategory || isSearching) { setSelectedCategory(null); setQuery(""); }
    else if (selectedSubject) setSelectedSubject(null);
    else if (selectedGrade) setSelectedGrade(null);
    resetPage();
  };

  if (activeResource) {
    return (
      <div className="reader-page">
        <header className="site-header reader-site-header">
          <button className="back-button" onClick={() => setActiveResource(null)} type="button"><ArrowLeft aria-hidden="true" size={18} />Library</button>
          <div className="reader-title"><span>{labelFromFolder(activeResource.grade)} / {labelFromFolder(activeResource.subject)} / {categoryLabels[activeResource.category]}</span><strong>{activeResource.title}</strong></div>
          <div className="header-actions"><a aria-label="Open document in a new tab" className="icon-button" href={activeResource.path} rel="noreferrer" target="_blank"><ExternalLink aria-hidden="true" size={18} /></a><ThemeToggle /></div>
        </header>
        <main className="full-reader" id="document-reader"><iframe className="document-frame" src={activeResource.path} title={activeResource.title} /></main>
      </div>
    );
  }

  const renderCollectionCards = () => {
    if (!selectedGrade) {
      return grades.map((grade) => {
        const count = resources.filter((resource) => resource.grade === grade).length;
        return <button className="category-card" key={grade} onClick={() => chooseGrade(grade)} type="button"><GraduationCap aria-hidden="true" size={25} /><span className="card-label">Class</span><strong>{labelFromFolder(grade)}</strong><p>{count} {count === 1 ? "document" : "documents"} across your subjects.</p><span className="card-action">Choose class <ArrowRight aria-hidden="true" size={17} /></span></button>;
      });
    }
    if (!selectedSubject) {
      return subjects.map((subject) => {
        const count = resources.filter((resource) => resource.grade === selectedGrade && resource.subject === subject).length;
        return <button className="category-card" key={subject} onClick={() => chooseSubject(subject)} type="button"><BookOpen aria-hidden="true" size={25} /><span className="card-label">Subject</span><strong>{labelFromFolder(subject)}</strong><p>{count} {count === 1 ? "document" : "documents"} ready to revise.</p><span className="card-action">Choose subject <ArrowRight aria-hidden="true" size={17} /></span></button>;
      });
    }
    return CATEGORIES.map((category) => {
      const count = resources.filter((resource) => resource.grade === selectedGrade && resource.subject === selectedSubject && resource.category === category).length;
      return <button className="category-card" key={category} onClick={() => chooseCategory(category)} type="button"><BookOpen aria-hidden="true" size={25} /><span className="card-label">{categoryLabels[category]}</span><strong>{count} {count === 1 ? "document" : "documents"}</strong><p>{categoryDescriptions[category]}</p><span className="card-action">Browse <ArrowRight aria-hidden="true" size={17} /></span></button>;
    });
  };

  const collectionHeading = !selectedGrade ? "Choose a class" : !selectedSubject ? "Choose a subject" : "Choose a library";
  const libraryTrail = [selectedGrade && labelFromFolder(selectedGrade), selectedSubject && labelFromFolder(selectedSubject)].filter(Boolean).join(" / ");

  return (
    <div className="atlas-shell">
      <a className="skip-link" href="#library-content">Skip to library</a>
      <header className="site-header"><div className="brand"><FolderOpen aria-hidden="true" size={21} strokeWidth={1.8} /><span>Atlas</span></div><p className="site-subtitle">Study library</p><div className="header-actions"><InstallApp /><ThemeToggle /></div></header>
      <main className="library-page" id="library-content">
        <section className="library-intro" aria-labelledby="library-title"><p className="eyebrow">Your revision space</p><h1 id="library-title">Find the right material, fast.</h1><p>Browse by class, subject, and type, or search every document in your library.</p><label className="library-search"><Search aria-hidden="true" size={19} /><span className="sr-only">Search all study material</span><input onChange={(event) => updateSearch(event.target.value)} placeholder="Search all classes and subjects" type="search" value={query} /></label></section>
        {isDocumentView ? (
          <section aria-labelledby="documents-title" className="document-collection">
            <div className="section-heading collection-heading"><div><button className="text-button" onClick={goBack} type="button"><ArrowLeft aria-hidden="true" size={16} />{isSearching ? "Clear search" : libraryTrail}</button><h2 id="documents-title">{isSearching ? "Search results" : categoryLabels[selectedCategory!]}</h2></div><span>{filteredResources.length === 0 ? "No documents" : `Showing ${pageStart + 1}-${Math.min(pageStart + PAGE_SIZE, filteredResources.length)} of ${filteredResources.length}`}</span></div>
            {pageResources.length > 0 ? <div className="document-grid">{pageResources.map((resource) => <button className="document-card" key={resource.id} onClick={() => setActiveResource(resource)} type="button"><FileText aria-hidden="true" size={21} /><h3>{resource.title}</h3><span className="document-open">Open document <ArrowRight aria-hidden="true" size={16} /></span></button>)}</div> : <div className="empty-state"><FileText aria-hidden="true" size={30} /><h2>No documents found</h2><p>Try a different search term, or add an HTML file to a class, subject, and library folder.</p></div>}
            {totalPages > 1 && <nav aria-label="Document pages" className="pagination"><button disabled={currentPage === 1} onClick={() => setPage((current) => current - 1)} type="button"><ArrowLeft aria-hidden="true" size={16} /> Previous</button><span>Page {currentPage} of {totalPages}</span><button disabled={currentPage === totalPages} onClick={() => setPage((current) => current + 1)} type="button">Next <ArrowRight aria-hidden="true" size={16} /></button></nav>}
          </section>
        ) : (
          <section aria-labelledby="collections-title"><div className="section-heading"><div>{(selectedGrade || selectedSubject) && <button className="text-button" onClick={goBack} type="button"><ArrowLeft aria-hidden="true" size={16} />{selectedSubject ? labelFromFolder(selectedGrade!) : "All classes"}</button>}<p className="eyebrow">{libraryTrail || "Collections"}</p><h2 id="collections-title">{collectionHeading}</h2></div><span>{selectedSubject ? resources.filter((resource) => resource.grade === selectedGrade && resource.subject === selectedSubject).length : selectedGrade ? resources.filter((resource) => resource.grade === selectedGrade).length : resources.length} documents</span></div><div className="category-grid">{renderCollectionCards()}</div></section>
        )}
      </main>
    </div>
  );
}
