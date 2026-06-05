export interface ReviewScores {
  security: number;
  performance: number;
  maintainability: number;
  readability: number;
}

export interface Issue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'security' | 'performance' | 'maintainability' | 'readability' | 'bug';
  line_start: number | null;
  line_end: number | null;
  title: string;
  description: string;
  fix: string;
}

export interface ReviewResult {
  language: string;
  summary: string;
  scores: ReviewScores;
  issues: Issue[];
  positive_points: string[];
  recommendations: string[];
}

export interface Review {
  id: string;
  user_id: string;
  title: string;
  language: string;
  original_code: string;
  review_result: ReviewResult;
  score_security: number;
  score_performance: number;
  score_maintainability: number;
  score_readability: number;
  overall_score: number;
  issue_count: number;
  source: 'paste' | 'github' | 'webhook';
  github_repo: string | null;
  github_pr_number: number | null;
  status: 'pending' | 'complete' | 'error';
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  plan: 'free' | 'pro' | 'team';
  review_count: number;
  lemonsqueezy_customer_id: string | null;
  lemonsqueezy_subscription_id: string | null;
  github_access_token: string | null;
  github_username: string | null;
  created_at: string;
}

export interface ConnectedRepo {
  id: string;
  user_id: string;
  repo_full_name: string;
  repo_id: number;
  webhook_id: number;
  auto_review: boolean;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface TeamMember {
  team_id: string;
  user_id: string;
  role: 'owner' | 'member';
}
