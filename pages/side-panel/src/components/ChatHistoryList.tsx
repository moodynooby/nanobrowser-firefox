/* eslint-disable react/prop-types */

import { t } from '@extension/i18n';
import { BsBookmark } from 'react-icons/bs';
import { FaTrash } from 'react-icons/fa';

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
}

interface ChatHistoryListProps {
  sessions: ChatSession[];
  onSessionSelect: (sessionId: string) => void;
  onSessionDelete: (sessionId: string) => void;
  onSessionBookmark: (sessionId: string) => void;
  visible: boolean;
}

const ChatHistoryList: React.FC<ChatHistoryListProps> = ({
  sessions,
  onSessionSelect,
  onSessionDelete,
  onSessionBookmark,
  visible,
}) => {
  if (!visible) return null;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">{t('chat_history_title')}</h2>
      {sessions.length === 0 ? (
        <div className="rounded-lg bg-white/30 dark:bg-slate-800 text-gray-500 dark:text-gray-400 p-4 text-center backdrop-blur-sm">
          {t('chat_history_empty')}
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map(session => (
            <div
              key={session.id}
              className="group relative rounded-lg bg-white/50 dark:bg-slate-800 hover:bg-white/70 dark:hover:bg-slate-700 p-3 backdrop-blur-sm transition-all"
            >
              <button onClick={() => onSessionSelect(session.id)} className="w-full text-left" type="button">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">{session.title}</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatDate(session.createdAt)}</p>
              </button>

              {onSessionBookmark && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onSessionBookmark(session.id);
                  }}
                  className="absolute right-2 top-2 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 bg-white dark:bg-slate-700 text-accent hover:bg-gray-100 dark:hover:bg-slate-600"
                  aria-label={t('chat_history_bookmark')}
                  type="button"
                >
                  <BsBookmark size={14} />
                </button>
              )}

              <button
                onClick={e => {
                  e.stopPropagation();
                  onSessionDelete(session.id);
                }}
                className="absolute bottom-2 right-2 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 bg-white dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600"
                aria-label={t('chat_history_delete')}
                type="button"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistoryList;
