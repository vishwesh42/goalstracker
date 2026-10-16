import { GoalsDatabase, GistSyncConfig } from '../types';

const GIST_CONFIG_KEY = 'goalflow_gist_config_v1';

export function loadGistConfig(): GistSyncConfig {
  try {
    const raw = localStorage.getItem(GIST_CONFIG_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to load Gist config from localStorage:', err);
  }
  return {
    enabled: false,
    token: '',
    gistId: '',
  };
}

export function saveGistConfig(config: GistSyncConfig): void {
  try {
    localStorage.setItem(GIST_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save Gist config:', err);
  }
}

export function clearGistConfig(): void {
  localStorage.removeItem(GIST_CONFIG_KEY);
}

/**
 * Creates a new private Gist containing goals.json using the GitHub REST API.
 */
export async function createGistDatabase(
  token: string,
  initialData: GoalsDatabase
): Promise<{ gistId: string; gistUrl: string }> {
  const cleanToken = token.trim();
  const res = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${cleanToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: 'GoalFlow Live Database (goals.json)',
      public: false,
      files: {
        'goals.json': {
          content: JSON.stringify(initialData, null, 2),
        },
      },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create Gist (HTTP ${res.status}). Verify your token has 'gist' permission.`
    );
  }

  const data = await res.json();
  return {
    gistId: data.id,
    gistUrl: data.html_url,
  };
}

/**
 * Fetches goals.json from a GitHub Gist.
 */
export async function fetchGistDatabase(
  token: string,
  gistId: string
): Promise<{ database: GoalsDatabase; gistUrl: string }> {
  const cleanToken = token.trim();
  const cleanGistId = gistId.trim();

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (cleanToken) {
    headers.Authorization = `Bearer ${cleanToken}`;
  }

  const res = await fetch(`https://api.github.com/gists/${cleanGistId}`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch Gist #${cleanGistId} (HTTP ${res.status}).`
    );
  }

  const data = await res.json();
  const file = data.files?.['goals.json'];

  if (!file || !file.content) {
    throw new Error('Gist was found, but does not contain a "goals.json" file.');
  }

  const parsed = JSON.parse(file.content);
  if (!parsed || !Array.isArray(parsed.goals)) {
    throw new Error('Invalid database format inside goals.json: missing "goals" array.');
  }

  return {
    database: parsed,
    gistUrl: data.html_url,
  };
}

/**
 * Updates goals.json in an existing GitHub Gist.
 */
export async function saveGistDatabase(
  token: string,
  gistId: string,
  database: GoalsDatabase
): Promise<void> {
  const cleanToken = token.trim();
  const cleanGistId = gistId.trim();

  const res = await fetch(`https://api.github.com/gists/${cleanGistId}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${cleanToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        'goals.json': {
          content: JSON.stringify(
            {
              ...database,
              updatedAt: new Date().toISOString(),
            },
            null,
            2
          ),
        },
      },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update Gist (HTTP ${res.status}). Verify your token is valid.`
    );
  }
}
