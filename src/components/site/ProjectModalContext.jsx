import { createContext, useContext, useState } from "react";
import { ProjectModal } from "./ProjectModal";
import { useScrollLock } from "./useScrollLock";

const ProjectModalCtx = createContext(null);

export function ProjectModalProvider({ children }) {
  const [activeProject, setActiveProject] = useState(null);

  // Freeze background scrolling when any project modal is open
  useScrollLock(Boolean(activeProject));

  const openProjectModal = (project) => {
    setActiveProject(project);
  };

  const closeProjectModal = () => {
    setActiveProject(null);
  };

  return (
    <ProjectModalCtx.Provider
      value={{ activeProject, openProjectModal, closeProjectModal }}
    >
      {children}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={closeProjectModal}
          onSelectProject={openProjectModal}
        />
      )}
    </ProjectModalCtx.Provider>
  );
}

export function useProjectModal() {
  const ctx = useContext(ProjectModalCtx);
  if (!ctx) {
    return {
      activeProject: null,
      openProjectModal: () => {},
      closeProjectModal: () => {},
    };
  }
  return ctx;
}
