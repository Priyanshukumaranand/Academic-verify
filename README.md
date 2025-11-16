## 🧩 System Architecture Preview

```mermaid
flowchart LR
    %% =========================
    %% CLIENT LAYER
    %% =========================
    subgraph Client["Client Layer"]
        UStudent["Student / Graduate (Web / Mobile)"]
        UVerifier["Verifier (Employer / Recruiter)"]
        UAdmin["System Admin (Web Dashboard)"]
    end

    %% =========================
    %% EDGE / DELIVERY LAYER
    %% =========================
    subgraph Edge["Edge & Delivery Layer"]
        CDN["CDN / Static Assets"]
        WAF["WAF / Reverse Proxy"]
    end

    UStudent --> CDN
    UVerifier --> CDN
    UAdmin --> CDN
    CDN --> WAF

    %% =========================
    %% APPLICATION LAYER
    %% =========================
    subgraph App["Application Layer"]
        subgraph Frontend["Frontend DApp"]
            FE["React + Web3.js\nSingle Page Application"]
        end

        subgraph Backend["On-chain / Off-chain Services"]
            API["DApp Logic\n(Reads/Writes via Web3.js)"]

            subgraph Contracts["Ethereum Smart Contracts"]
                AdminSC["Admin Contract\n- Register employees\n- Register org endorsers\n- Map user → Employee contract"]
                EmployeeSC["Employee Contract(s)\n- Profile\n- Skills\n- Certifications\n- Work Experience\n- Education\n- Endorsements"]
                SkillsSC["Skills Contract\n- Global skills registry"]
            end

            subgraph OffChain["Off-chain Services"]
                Firestore["Firestore / DB\n- Chat metadata\n- Active conversations"]
                AvatarSvc["Avatar Service (ui-avatars.com)"]
                Notif["Toast Notifications\n(react-toastify)"]
            end
        end
    end

    WAF --> FE
    FE --> API
    API --> AdminSC
    API --> EmployeeSC
    API --> SkillsSC

    %% =========================
    %% DATA FLOWS
    %% =========================
    UStudent -->|Connect wallet (MetaMask)| FE
    UVerifier -->|Connect wallet (MetaMask)| FE
    UAdmin -->|Connect wallet (MetaMask)| FE

    FE -->|Employee data| EmployeeSC
    FE -->|Role checks & registry| AdminSC
    FE -->|Skill metadata| SkillsSC

    FE -->|Chat & notifications| Firestore
    FE -->|Generate avatars| AvatarSvc
    FE -->|User feedback| Notif
```
