import { BookOpen, ClipboardCheck, Megaphone, BarChart3, ArrowUpRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from './lib/api';

type Props = { profile: { fullName: string }; role: 'admin' | 'teacher' | 'student' };
type Envelope<T> = { data: T; meta?: { total: number } };

export default function DashboardPage({ profile, role }: Props) {
  const courses = useQuery({ queryKey: ['dashboard', 'courses'], queryFn: () => api<Envelope<any[]>>('/me/courses') });
  const assignments = useQuery({ queryKey: ['dashboard', 'assignments'], queryFn: () => api<Envelope<any[]>>('/me/assignments') });
  const quizzes = useQuery({ queryKey: ['dashboard', 'quizzes'], queryFn: () => api<Envelope<any[]>>('/me/quizzes') });
  const marks = useQuery({ queryKey: ['dashboard', 'marks'], queryFn: () => api<Envelope<any[]>>('/me/marks'), enabled: role === 'student' });
  const announcements = useQuery({ queryKey: ['dashboard', 'announcements'], queryFn: () => api<Envelope<any[]>>('/announcements') });
  const courseRows = courses.data?.data ?? [];
  const assignmentRows = assignments.data?.data ?? [];
  const quizRows = quizzes.data?.data ?? [];
  const markRows = marks.data?.data ?? [];
  const upcoming = assignmentRows.filter(a => new Date(a.due_at) >= new Date()).slice(0, 4);
  const average = markRows.length ? Math.round(markRows.reduce((sum, row) => sum + Number(row.obtained ?? 0) / Math.max(Number(row.max ?? 0), 1) * 100, 0) / markRows.length) : null;
  const pending = role === 'student' ? assignmentRows.filter(a => !a.submission).length : assignmentRows.length;
  const dateLabel = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  const firstName = profile.fullName.split(' ')[0];
  return <>
    <div className="welcome-row"><div><span className="eyebrow"><span className="live-dot" />{dateLabel}</span><h1>Welcome, {firstName}</h1><p className="muted">{role === 'student' ? 'Here is what is happening with your learning.' : role === 'teacher' ? 'Here is a current view of your courses and assessments.' : 'Here is a live overview of your portal.'}</p></div></div>
    <div className="stat-grid">
      <Stat icon={BookOpen} label={role === 'student' ? 'Active courses' : 'Courses'} value={courses.isLoading ? '…' : String(courseRows.length)} trend="Current term" color="lilac" />
      <Stat icon={ClipboardCheck} label={role === 'student' ? 'To submit' : 'Assignments'} value={assignments.isLoading ? '…' : String(pending)} trend={role === 'student' ? 'Awaiting submission' : 'Across your courses'} color="peach" />
      <Stat icon={ClipboardCheck} label="Quizzes" value={quizzes.isLoading ? '…' : String(quizRows.length)} trend="Available or scheduled" color="mint" />
      <Stat icon={BarChart3} label="Average mark" value={role === 'student' ? average === null ? '—' : `${average}%` : '—'} trend={role === 'student' ? markRows.length ? `${markRows.length} graded items` : 'No grades yet' : 'Student gradebook'} color="blue" />
    </div>
    <div className="dashboard-grid"><section className="panel courses-panel"><div className="panel-head"><div><span className="eyebrow">YOUR LEARNING</span><h2>{role === 'student' ? 'My courses' : 'Courses you teach'}</h2></div><Link to="/courses" className="text-link">All courses <ArrowUpRight size={14} /></Link></div>
      {courses.isLoading ? <div className="state-message">Loading courses…</div> : courses.isError ? <div className="state-message error-state">Could not load your courses.</div> : courseRows.length ? <div className="course-list">{courseRows.slice(0, 4).map((course: any, i: number) => <article className="course-card" key={course.id}><div className={`course-art ${['violet', 'mint', 'coral'][i % 3]}`}><span className="course-code">{course.code}</span><div className="art-symbol"><BookOpen size={25} /></div><span className="art-index">{String(i + 1).padStart(2, '0')}</span></div><div className="course-info"><div className="course-title"><div><h3>{course.title}</h3><p>{course.description || course.code}</p></div></div><div className="course-foot"><span><Clock3 size={13} />{assignmentRows.filter(a => a.course_id === course.id).length} assignments</span><Link to="/assignments" aria-label={`View ${course.title} assignments`}><ArrowUpRight size={16} /></Link></div></div></article>)}</div> : <div className="state-message">You are not enrolled in any active courses yet.</div>}
      <Link to="/courses" className="view-courses">Open courses <ArrowUpRight size={15} /></Link>
    </section><div className="right-column"><section className="panel schedule-panel"><div className="panel-head"><div><span className="eyebrow">ASSESSMENTS</span><h2>Coming up</h2></div><Link to="/assignments" className="icon-btn" aria-label="View assignments"><ClipboardCheck size={17} /></Link></div>
      {assignments.isLoading ? <div className="state-message">Loading deadlines…</div> : upcoming.length ? upcoming.map((a: any, i: number) => <div className="event" key={a.id}><div className="event-time">{new Date(a.due_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div><div className={`event-line ${i % 2 ? 'mint-line' : 'violet-line'}`} /><div><b>{a.title}</b><p>{a.courses?.code} · {a.courses?.title}</p><span className="event-tag">DUE {new Date(a.due_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span></div></div>) : <div className="state-message">No upcoming assignment deadlines.</div>}
      <Link to="/assignments" className="schedule-link">View all assignments <ArrowUpRight size={14} /></Link></section>
      <section className="panel announcement-panel"><div className="panel-head"><div><span className="eyebrow">CAMPUS PULSE</span><h2>Latest updates</h2></div><span className="unread">{announcements.data?.data.filter((a: any) => !a.isRead).length ?? 0} NEW</span></div>
        {(announcements.data?.data ?? []).slice(0, 3).map((a: any) => <div className="announcement" key={a.id}><span className="announcement-icon violet"><Megaphone size={17} /></span><div><small>{new Date(a.created_at).toLocaleDateString()}</small><b>{a.title}</b></div>{!a.isRead && <i />}</div>)}
        {!announcements.isLoading && !announcements.data?.data.length && <div className="state-message">No announcements yet.</div>}<Link to="/announcements" className="schedule-link">See all announcements <ArrowUpRight size={14} /></Link></section></div></div>
    <footer className="footer"><span>GU<span className="brand-accent">TECH</span> · LEARNING PORTAL</span><span>Made for curious minds <span className="heart">✳</span></span></footer>
  </>;
}

function Stat({ icon: Icon, label, value, trend, color }: { icon: typeof BookOpen; label: string; value: string; trend: string; color: string }) {
  return <article className="stat-card"><div className="stat-top"><span className={`stat-icon ${color}`}><Icon size={17} /></span><span className="stat-menu">···</span></div><span className="stat-label">{label}</span><div className="stat-bottom"><b>{value}</b><small>{trend}</small></div></article>;
}
