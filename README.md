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
            FE["SPA Frontend (React / Vue / Angular)\n- Credential submission forms\n- Verification request UI\n- Admin dashboard\n- Error & notification UI"]
        end

        subgraph Backend["Backend Service (API)"]
            API["REST/GraphQL API Server\n(Node.js / Django / Spring / etc.)"]

            subgraph Modules["Domain Modules"]
                AuthService["Auth Module\n- JWT / OAuth2\n- Role-based access control\n- Session management"]
                UserService["User Module\n- Students & verifiers profiles\n- University accounts\n- Admin users"]
                CredentialService["Credential Module\n- Upload & store degrees/transcripts\n- Normalize metadata\n- Validate document structure"]
                VerificationService["Verification Module\n- Issue verification requests\n- Check status\n- Generate verification reports"]
                InstitutionService["Institution Integration Module\n- University registry lookup\n- API/webhook integrations\n- Manual review workflows"]
                NotificationService["Notification Module\n- Email / SMS / In-app notifications\n- Verification status updates\n- Admin alerts"]
                AuditService["Audit & Logging Module\n- Immutable audit logs\n- Access trace & changes history"]
            end

            subgraph Background["Background Processing"]
                Worker["Background Worker(s)\n- Long-running verifications\n- Bulk document processing\n- Scheduled sync with institutions"]
                Queue["Message Queue\n(e.g., RabbitMQ / SQS / Redis)\n- Async task dispatch\n- Rate control for external APIs"]
                Scheduler["Job Scheduler\n- Nightly sync jobs\n- Expiry checks\n- Cleanup tasks"]
            end
        end
    end

    WAF --> FE
    FE -->|HTTPS / JSON| API

    API --> AuthService
    API --> UserService
    API --> CredentialService
    API --> VerificationService
    API --> InstitutionService
    API --> NotificationService
    API --> AuditService

    VerificationService --> Queue
    CredentialService --> Queue
    Scheduler --> Queue
    Queue --> Worker

    %% =========================
    %% DATA & STORAGE LAYER
    %% =========================
    subgraph Data["Data & Storage Layer"]
        DBMain["Relational DB\n(PostgreSQL / MySQL)\n- Users\n- Credentials\n- Verifications\n- Institutions"]
        DBLogs["Logging / Analytics DB\n(e.g., Elasticsearch, ClickHouse)\n- Request logs\n- Audit logs\n- Metrics"]
        Blob["Object Storage\n(S3 / GCS / Azure Blob)\n- Uploaded certificates\n- Scanned documents\n- Attachments"]
        Cache["Cache\n(Redis / Memcached)\n- Session cache\n- Verification status cache\n- Frequently used lookups"]
    end

    UserService --> DBMain
    CredentialService --> DBMain
    VerificationService --> DBMain
    InstitutionService --> DBMain
    AuditService --> DBLogs

    CredentialService --> Blob
    Worker --> Blob

    AuthService --> Cache
    VerificationService --> Cache
    UserService --> Cache

    Worker --> DBMain
    Worker --> DBLogs

    %% =========================
    %% EXTERNAL INTEGRATIONS
    %% =========================
    subgraph External["External Systems & Services"]
        UnivAPIs["University / Institution APIs\n- Enrollment status\n- Degree validation\n- Transcript verification"]
        EmailSvc["Email Provider\n(SendGrid / SES / etc.)"]
        SmsSvc["SMS Provider\n(Twilio / etc.)"]
        IdP["Identity Provider / SSO\n(Google, Microsoft, etc.)"]
        KYC["KYC / Identity Verification\n(Optional for user identity checks)"]
        Blockchain["Blockchain / Credential Registry\n(Optional)\n- On-chain credential hashes\n- Public verification endpoint"]
    end

    InstitutionService --> UnivAPIs
    NotificationService --> EmailSvc
    NotificationService --> SmsSvc
    AuthService --> IdP
    VerificationService --> KYC
    VerificationService --> Blockchain

    %% =========================
    %% OBSERVABILITY & OPS
    %% =========================
    subgraph Ops["Observability & Operations"]
        Metrics["Metrics & Monitoring\n(Prometheus / CloudWatch / etc.)"]
        Tracing["Distributed Tracing\n(Jaeger / OpenTelemetry)"]
        Logging["Centralized Logging\n(ELK / Loki / etc.)"]
        Secrets["Secrets Manager\n- API keys\n- DB credentials\n- OAuth secrets"]
    end

    API --> Metrics
    API --> Tracing
    API --> Logging
    Worker --> Metrics
    Worker --> Logging
    Backend --> Secrets
