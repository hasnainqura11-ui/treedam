'use client'
import { Link } from './routing'
import { TreedamLogo } from './BrandIcons'

export function TreeDashboard() {
  const cards = ['To Plant', 'Still Growing', 'Verify', 'Verified']
  return (
    <div className="dashboard">
      <aside>
        <Link to="/" className="brand"><TreedamLogo size="sm" /></Link>
        <span>▦ &nbsp; Dashboard</span>
        <span>⌕ &nbsp; Explore</span>
        <span>▣ &nbsp; Trees</span>
        <span>◇ &nbsp; Analytics</span>
      </aside>
      <div className="dash-main">
        <div className="dash-top">
          <b>Dashboard</b>
          <span>⌕ &nbsp; Search</span>
          <span>● &nbsp; ◌</span>
        </div>
        <h3>Checklist - To Plant</h3>
        <p>All the trees you must care for, in one place.</p>
        <div className="kanban">
          {cards.map((card, index) => (
            <div className="kanban-col" key={card}>
              <b>{card}</b>
              <small>{['120 trees', '340 trees', '85 trees', '960 trees'][index]}</small>
              <article>
                <i className={`label label-${index}`} />
                <strong>{['Chinar plot', 'Watering round', 'Survival photo check', 'Forest certified'][index]}</strong>
                <p>Tracked by GPS and cared for by planters.</p>
                <span>○ ○ ○</span>
              </article>
              <article className="muted-card">
                <strong>{['Mango plot', 'Fertilizer day', 'Drone survey', 'Carbon report'][index]}</strong>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
