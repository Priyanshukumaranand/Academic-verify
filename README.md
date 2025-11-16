## 🧩 System Architecture Preview

The **Academic-verify** platform is a blockchain‑based academic management and verification system that stores and verifies student records using Ethereum smart contracts. The diagram below summarizes the high‑level architecture:

```mermaid
flowchart LR
    %% =========================
    %% CLIENT LAYER
    %% =========================
    subgraph Client["Client Layer"]
        UStudent["Student / Graduate\n(Web / Mobile Browser)"]
        UVerifier["Verifier (Employer / Recruiter)\n(Web / Mobile Browser)"]
        UAdmin["System Admin\n(Web Dashboard)"]
    end

    %% =========================
    %% EDGE / DELIVERY LAYER
    %% =========================
    subgraph Edge["Edge & Delivery Layer"]
        CDN["CDN / Static Asset Hosting\n(JS, CSS, Images)"]
        WAF["WAF / API Gateway\nRate limiting, auth, routing"]
    end

    UStudent --> CDN
    UVerifier --> CDN
    UAdmin --> CDN
    CDN --> WAF

    %% =========================
    %% APPLICATION LAYER
    %% =========================
    subgraph App["Application Layer"]
        subgraph Frontend["Frontend App"]
            FE["SPA Frontend (React)\n- Profile & credential management\n- Endorsement workflows\n- Admin dashboard\n- Notification UI"]
        end

        subgraph Backend["Smart-Contract Backend + Off-chain Services"]
            API["DApp Logic (Web3.js + React)\n- Reads/writes to Ethereum\n- Role detection (Admin / Employee / Org Endorser)"]

            subgraph Contracts["Ethereum Smart Contracts"]
                AdminSC["Admin Contract\n- Register employees\n- Register organization endorsers\n- Map user -> Employee contract\n- Ownership checks"]
                EmployeeSC["Employee Contract(s)\n- Employee profile\n- Skills\n- Certifications\n- Work experience\n- Education\n- Endorsements"]
                SkillsSC["Skills Contract\n- Global skills registry\n- Shared skill metadata"]
            end

            subgraph OffChain["Off-chain Services"]
                Firestore["Firestore / DB\n- Chat metadata\n- Active conversations"]
                AvatarSvc["Avatar Service\n(ui-avatars.com)\n- Dynamic user avatars"]
                Notif["Toast Notifications\n(react-toastify)\n- UX feedback"]
            end
        end
    end

    WAF --> FE
    FE -->|Web3.js calls| API
    API --> AdminSC
    API --> EmployeeSC
    API --> SkillsSC

    %% =========================
    %% DATA FLOWS
    %% =========================
    UStudent -->|Connect wallet\n(MetaMask)| FE
    UVerifier -->|Connect wallet| FE
    UAdmin -->|Connect wallet| FE

    FE -->|Read/write\nemployee data| EmployeeSC
    FE -->|Register users,\ncheck roles| AdminSC
    FE -->|Manage skills| SkillsSC

    FE --> Firestore
    FE --> AvatarSvc
    FE --> Notif
```

> This diagram shows how **React + Web3.js** interact with **Admin**, **Employee**, and **Skills** smart contracts on Ethereum, while using off‑chain services (like Firestore and avatar generation) for chat and UI enhancements.
