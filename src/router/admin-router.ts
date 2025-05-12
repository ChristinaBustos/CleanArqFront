export default [
    {
        path: "/codec/v",
        component: () => import("../views/HomeView.vue"),
        redirect:{ name:"home-page"},
        name: "codec",
        meta: { requiresAuth: true },
        children: [
            {
                path: 'discipline',
                name: 'discipline',
                component: () => import('../modules/disciplines/adapters/view/DisciplineList.vue'),
                meta: { requiresAuth: true }
            }
        ]
            
    }
]