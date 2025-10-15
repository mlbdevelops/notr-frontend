"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const NotFound = () => {
  const router = useRouter();
  const [sec, setSec] = useState(3);

  useEffect(() => {
    if (sec > 0) {
      const timer = setTimeout(() => setSec(sec - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push("/");
    }
  }, [sec, router]);

  return (
    <div
      style={{
        color: "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          padding: "60px 10px",
          borderRadius: "20px",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <h1
          style={{
            fontSize: "6rem",
            margin: 0,
            color: "#6a69fe",
            textShadow: "0 0 15px rgba(255,255,255,0.2)",
            letterSpacing: "2px",
            animation: "float 2s ease-in-out infinite",
          }}
        >
          404
        </h1>

        <h2
          style={{
            marginTop: "10px",
            fontSize: "1.6rem",
            color: "#fff",
            opacity: 0.9,
          }}
        >
          Ooopzzz! Page not found.
        </h2>

        <p
          style={{
            fontSize: "1rem",
            color: "#d1d1d1",
            marginTop: "15px",
            lineHeight: "1.6",
          }}
        >
          The page you’re looking for doesn’t exist or has been moved.
          <br />
          Redirecting to{" "}
          <Link
            href="/"
            style={{
              color: "#6a69fe",
              textDecoration: "none",
              fontWeight: 600,
              transition: "color 0.3s ease",
            }}
          >
            Home
          </Link>{" "}
          in {sec} second{sec !== 1 ? "s" : ""}...
        </p>

        <div
          style={{
            marginTop: "30px",
            height: "10px",
            padding: 2,
            width: "100%",
            background: "white",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(sec / 3) * 100}%`,
              background: "#6a69fe",
              transition: "width 1s linear",
              borderRadius: 100
            }}
          ></div>
        </div>

        <div style={{ marginTop: "25px" }}>
          <Link
            href="/"
            style={{
              backgroundColor: "#262626",
              color: "white",
              padding: "10px 30px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: 600,
              transition: "all 0.3s ease",
            }}
          >
            Go Home Now
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;