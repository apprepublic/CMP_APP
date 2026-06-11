'use client';

const activeContests = [
  {
    id: 1,
    title: 'Best Afrobeat Track',
    description: 'Vote for your favorite Afrobeat track of the month',
    prize: '50,000 Coins',
    participants: 24,
    endsIn: '2 days',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuYoPpo9F8aR-AxWbnqvvg-_sloUORxhAKDUwj6JFxzcz0ywXP0Cu0Dp8Iy9ngh80cQMVGpKRxsrLcQdw3qJAZfXvFa1L2zPO0jvJ2fIaoyM_-oH9U0sarhDtl7FOb-zT5pSFor2fO3LJpYauSZ-K9MnAYoHu301hTKZmis-X3WDhabiPRxmR5j4_fWRJZkzv5LLEcJtE_Ilx2q1ZJLPmtmipFovObg9r8Lk7inN9bU1C4GmdydzRhhWn2v-fTPP-tKoVCyYIwCdQ',
  },
  {
    id: 2,
    title: 'Rising Artist Spotlight',
    description: 'Support emerging artists and win prizes',
    prize: '25,000 Coins',
    participants: 56,
    endsIn: '5 days',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzLGvgJpTWyp5b6RtIEsUB0RxpzhO3qdAnl12-MhCQtVc5ZUJwKctKDislZDoAlzfik90UpzVzbpaXHVGqhEgdZSm8VceSsDEdeRbXulbPqnU6ufq9Z2udTsO43Vl13EqRT_FcjdEK4E50YHeZnJDDrMQHcOOw8u15mfsli1_zpD4aT_LiZyMBKewKcZmF3XpMkKnPkObEVccDswY2PewdkGeay9Vk1EaAzLxgfW7O_0cBCum4MY3bpYYkiyXVUw_cpzCYcO0zyeI',
  },
];

const topContestants = [
  { rank: 1, name: 'DJ Horizon', votes: 12450, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBE3pxt9qWHcXBSPsyxNGFoO-0Fp1JADPZzlFKBo6LchDLYGjhXHDh0KBI6mxEwSQ_mjTF19Q6glEJIYzVJ4ddam1Htz-rjt2xa9DheCZJfVL0WPpkLd7fhDZlmNK6BcWNeZJAjVbxXar3wsXTjXe63CZkXzxTdpSrOIGht1q9lF7FDeSClsdJXNLfu04BiHDwSjjWxyFzbpnWRDMmIrj8AUEqqPdRXj1VrDc20gbZAlHLVZN8W-lX7KrIyPTcaUW7zG8b_2C8XBDM' },
  { rank: 2, name: 'Luna Ray', votes: 9820, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7Af3eE_a5GnQXgUejCqF84ctWacoCpUwWZir6ARQV3-Q2P6NyQRjOoOeDqezMi-w1ZEIocCPAxpbwKI-5AqVavvhuMQKI0eU6L9bd_rIgaFX4oawlCkK3nR-ZGepfPizi2JRJppkcpClTFJhr_ou6s_m1QIHcao1njfS844c-zPeASWIKABS9TSJIVA-TVpKCXVn0HDjeHXn4ldEPxKru_SW8PJIet_RjP0ItDo35Wa0KnOTk07l7TlMIhtcu4L1KScE7015EkhLu' },
  { rank: 3, name: 'SynthX', votes: 7650, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzd2O0MXDHdCXA34o22ti3gHptyVbN-mLZ-8hQ3qNUotTYBKEZFF1sDD8wAgWxYFF8XJ7wQxP_yw1sJlOYQDixjk4UvSx0Y8Ta3AtyG8mTivlIyH8QYL31-s93GNc7ImJvLdLIxih0I_sPypIZuLeQnEiCDVLgkTtMw7D-OHiQ3Vr_QtUocjNTrnJ57ZraP3mNprOzJQ7xwbZPIop_bYgYz_HNvIsHbngbjZzvjBwTRJL-FAlpq_g2JA1eNMuY8SiRLp8TB1MzzMFw' },
  { rank: 4, name: 'Beats Master', votes: 5430, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3Vnh4W1X-q0mqfDOXVCzrcN1ssAW8v-Y_plKQ_8xmO1IBwpLgTzTxR7CHl5Ksf1gDSDCnRt-kEtNSq07so4e1IVRrg6kkc3GiHRYGiIlmP6VU9pwlan_ELL27Y2EbneaKjnTe1Lk2IESKVZ9u8YtMl1qZsWzeAxY5HR6SATjVtkc9hPXXLplay40xDUOpSwO8id96vIZKNRqZbHT6AF6-Cpn2-PToC4muYr_d26Bzb0d6eHDwvtnE-5A139VSNbCgb4CXYL0hCYg' },
  { rank: 5, name: 'Melody Queen', votes: 4320, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4T_fWKjmUQnFq5HNcynE3Pzw3sOap9AVg1oCepRdDKQchl1ddjDA_Q3KjtFsOcHHhMbq5DkywbCQGBHI0nocgskpqbS3BnqJ8QjBr7IQlsKGTp7hnJBrOSure4rt9vHuiHxeblg6glBSlNQvd2PDdwLWpcloFfPuMy8zCyWbsc8SaBZLNsopGRzJr79uA7FUYC4a6pJZyBKTtv3DaWXzxA43T7NZ4R8HqWNlTkClUDYsGTEFlFI1r1PAgKZiKy_b_Kl9R1fmf_Dk' },
];

export default function ContestsPage() {
  return (
    <div className="space-y-gutter">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary mb-4">Voting Contests</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Vote for your favorite creators and stand a chance to win prizes. Every vote counts!
        </p>
      </div>

      {/* Active Contests */}
      <section className="space-y-6">
        <h2 className="font-h3 text-h3 text-on-background">Active Contests</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeContests.map((contest) => (
            <div key={contest.id} className="bg-primary-container rounded-xl overflow-hidden group cursor-pointer">
              <div className="relative h-48">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={contest.title}
                  src={contest.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-secondary text-primary font-label-caps text-label-caps px-3 py-1 rounded-full">
                  {contest.endsIn} left
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-h3 text-h3 text-on-primary mb-2">{contest.title}</h3>
                <p className="font-body-sm text-on-primary-container mb-4">{contest.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-sm">emoji_events</span>
                      <span className="font-data-md text-data-md text-on-primary">{contest.prize}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-on-primary-container text-sm">group</span>
                      <span className="font-body-sm text-on-primary-container">{contest.participants} participants</span>
                    </div>
                  </div>
                  <button className="bg-secondary text-primary font-body-md font-semibold px-6 py-2 rounded-lg hover:bg-secondary-fixed transition-colors">
                    Vote Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-h3 text-h3 text-on-background">Current Leaderboard</h2>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">emoji_events</span>
            <span className="font-body-md text-body-md font-medium">Best Afrobeat Track</span>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <div className="md:mt-8">
            <div className="bg-surface-alt rounded-xl p-4 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden border-2 border-surface-variant">
                <img className="w-full h-full object-cover" alt={topContestants[1].name} src={topContestants[1].image} />
              </div>
              <span className="font-label-caps text-label-caps text-surface-tint block mb-1">2ND</span>
              <h4 className="font-body-md text-body-md font-semibold">{topContestants[1].name}</h4>
              <p className="font-data-md text-data-md text-secondary">{topContestants[1].votes.toLocaleString()} votes</p>
            </div>
          </div>

          {/* 1st Place */}
          <div>
            <div className="bg-secondary-container rounded-xl p-4 text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden border-4 border-secondary">
                <img className="w-full h-full object-cover" alt={topContestants[0].name} src={topContestants[0].image} />
              </div>
              <span className="font-label-caps text-label-caps text-secondary block mb-1">1ST</span>
              <h4 className="font-h3 text-h3">{topContestants[0].name}</h4>
              <p className="font-data-lg text-data-lg text-secondary">{topContestants[0].votes.toLocaleString()} votes</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="md:mt-12">
            <div className="bg-surface-alt rounded-xl p-4 text-center">
              <div className="w-14 h-14 rounded-full mx-auto mb-3 overflow-hidden border-2 border-surface-variant">
                <img className="w-full h-full object-cover" alt={topContestants[2].name} src={topContestants[2].image} />
              </div>
              <span className="font-label-caps text-label-caps text-surface-tint block mb-1">3RD</span>
              <h4 className="font-body-md text-body-md font-semibold">{topContestants[2].name}</h4>
              <p className="font-data-md text-data-md text-secondary">{topContestants[2].votes.toLocaleString()} votes</p>
            </div>
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="space-y-2">
          {topContestants.slice(3).map((contestant) => (
            <div key={contestant.rank} className="flex items-center justify-between p-4 bg-surface-alt rounded-lg">
              <div className="flex items-center gap-4">
                <span className="font-data-lg text-data-lg text-on-surface-variant w-8">{contestant.rank}</span>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img className="w-full h-full object-cover" alt={contestant.name} src={contestant.image} />
                </div>
                <h4 className="font-body-md text-body-md font-medium">{contestant.name}</h4>
              </div>
              <span className="font-data-md text-data-md text-secondary">{contestant.votes.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}