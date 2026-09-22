# SkillSwap — Architectural Decision Points (DECISIONS.md)

**Track 2: Real-World AI Products · Creator Economy Marketplace**  
**Team**: Haridwar Team 22 (`Lakshya Kumar`)  
**Product**: SkillSwap — Creator Gig Marketplace  

This document articulates our deliberate architectural decisions for the three core Decision Points specified in the Code2Career Track 2 brief.

---

## DP1 · Rejection

### Decision
When a creator declines an incoming booking request, the booking remains fully visible to the client in their **My Bookings** dashboard with a prominent `Declined` status badge, along with the creator's structured reason for declining (e.g., *"Currently at full capacity"*, *"Scope outside technical boundaries"*, or custom feedback). The client is offered immediate 1-click discovery of alternative creators offering comparable gigs in the same category, as well as an option to adjust and resubmit their brief.

### Rationale (Why)
Silently removing or hiding rejected bookings causes severe disorientation and mistrust—clients question whether payment occurred, if their order was lost, or if the platform is malfunctioning. Preserving the declined record with actionable feedback establishes complete operational transparency, respects the creator's autonomy to manage workload, and minimizes client bounce rates by proactively routing them to alternative creators ready to accept the project.

---

## DP2 · Double Booking

### Decision
A gig **CAN** accept multiple incoming bookings while another is still in the `Pending` state, but strict atomic concurrency control is enforced at the time of **Acceptance**: once a creator accepts a booking that occupies their delivery window/capacity, any conflicting pending requests are flagged, and attempting to double-commit triggers a `409 Conflict` resolution flow.

### Rationale (Why)
Locking a gig the moment a single client submits a pending request would freeze a creator's marketplace pipeline every time a client submits an exploratory or unresponsive booking. Since a pending booking is an unconfirmed inquiry rather than a contracted milestone, allowing parallel pending requests enables creators to review incoming demand and prioritize suitable work. Enforcing atomic checks on status confirmation (`Pending` $\rightarrow$ `Accepted`) guarantees that creators never overcommit or compromise service delivery quality.

---

## DP3 · Discovery & Marketplace Ranking

### Decision
Gigs on the marketplace page are ranked by default using **Dynamic Multi-Factor Rotation with Emerging Creator Boost (Newest Verified First)**, supplemented by client controls to sort by Newest, Price (Ascending/Descending), and Rating. 

### Rationale (Why)
Defaulting purely to rating or review counts creates an insurmountable "cold start" barrier and winner-take-all monopoly where legacy freelancers hoard 95% of marketplace traffic while young, talented creators churn due to zero impressions. Conversely, sorting solely by lowest price triggers a race-to-the-bottom destructive to creator livelihood and deliverable quality. Our hybrid rotation algorithm ensures freshly listed, vetted gigs receive immediate visibility in prime marketplace slots, democratizing platform discovery and stimulating active creator onboarding.

---

*Authored for Code2Career Track 2 Hackathon Evaluation · Haridwar Team 22*
