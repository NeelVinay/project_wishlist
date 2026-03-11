import React from "react";

export default function ShineStyle() {
  return <style dangerouslySetInnerHTML={{ __html: "@keyframes shine{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}" }} />;
}
