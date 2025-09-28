"use client";

import dynamic from "next/dynamic";
import "tui-image-editor/dist/tui-image-editor.css";
import styles from "../styles/editor.module.css";

// Dynamic import to avoid SSR issues
const ImageEditor = dynamic(
  () => import("@toast-ui/react-image-editor"),
  { ssr: false }
);

export default function EditorPage() {
  const editorRef = (ref) => {
    if (ref) {
      console.log("Editor loaded:", ref);
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorWrapper}>
        <ImageEditor
          ref={editorRef}
          includeUI={{
            loadImage: {
              path: "https://placekitten.com/800/500",
              name: "Kitten",
            },
            theme: {},
            menu: [
              "crop",
              "flip",
              "rotate",
              "draw",
              "shape",
              "text",
              "mask",
              "filter",
            ],
            initMenu: "filter",
            uiSize: {
              width: "100%",  // responsive width
              height: "100%", // responsive height
            },
            menuBarPosition: "bottom",
          }}
          cssMaxHeight={700}
          cssMaxWidth={1000}
          selectionStyle={{
            cornerSize: 20,
            rotatingPointOffset: 70,
          }}
          usageStatistics={false}
        />
      </div>
    </div>
  );
}