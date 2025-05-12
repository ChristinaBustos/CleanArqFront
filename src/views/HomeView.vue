<template>
  <body>
    <div class="customContainer">
      <div class="menu-btn" @click="toggleSidebar">
        <b-icon class="icon" icon="list"></b-icon>
      </div>
      
      <div class="sidebar" :class="{ active: sidebarActive }">
        <div class="sidebar-content">
          <div class="head">
            <div class="user-img">
              <img :src="sidebarLogo || defaultSidebarLogo" alt="Logo" />
            </div>
            <div class="user-details">
              <p class="name">{{ user }}</p>
            </div>
          </div>
          <div class="nav">
            <div class="menu">
              <p class="title">Menú</p>
              <ul>
                <li>
                  <b-link :to="{ name: 'periods' }">
                    <CalendarIcon class="icon" />
                    <span class="text">Periodos</span>
                  </b-link>
                </li>
                <li>
                  <b-link :to="{ name: 'group' }">
                    <UsersIcon class="icon" />
                    <span class="text">Grupos</span>
                  </b-link>
                </li>
                <li>
                  <a href="#" @click.prevent="toggleSubmenu">
                    <BookIcon class="icon" />
                    <span class="text">Directorios principales</span>
                    <b-icon class="arrow" icon="chevron-down"></b-icon>
                  </a>
                  <ul class="sub-menu">
                    <li>
                      <b-link :to="{ name: 'workspaces' }">
                        <span class="text">Espacios</span>
                      </b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'discipline' }">
                        <span class="text">Disciplinas</span>
                      </b-link>
                    </li>
                    <li>
                      <b-link :to="{ name: 'reports' }">
                        <span class="text">Reportes</span>
                      </b-link>
                    </li>
                  </ul>
                </li>
                <li>
                  <b-link :to="{ name: 'users' }">
                    <UserIcon class="icon" />
                    <span class="text">Usuarios</span>
                  </b-link>
                </li>
                <li>
                  <b-link :to="{ name: 'visual-config' }">
                    <SettingsIcon class="icon" />
                    <span class="text">Configuración visual</span>
                  </b-link>
                </li>
              </ul>
            </div>
            <div class="menu">
              <p class="title">Sesión</p>
              <ul>
                <li>
                  <b-button href="#" variant="link" @click="logout">
                    <LogOutIcon class="icon" />
                    <span class="text">Cerrar sesión</span>
                  </b-button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </body>
</template>
