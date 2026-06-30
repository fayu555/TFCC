import { NavLink } from 'react-router-dom'
import { Box, Divider, Drawer, List, ListItemButton, Typography } from '@mui/material'

const links = [
  { label: 'Schedule', to: '/schedule' },
  { label: 'Expenses', to: '/expenses' },
  { label: 'Availability', to: '/availability' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Umpires', to: '/umpires' },
]

const drawerWidth = 280

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#0f172a',
            color: '#f8fafc',
            border: 'none',
            px: 2,
          },
        }}
      >
        <Box sx={{ py: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            The Force Cricket Club
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(248,250,252,0.78)', mb: 2 }}>
            Let’s make great memories with the game.
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 2 }} />
        <List disablePadding>
          {links.map((link) => (
            <ListItemButton
              key={link.to}
              component={NavLink}
              to={link.to}
              sx={{
                borderRadius: 3,
                mb: 1,
                color: '#cbd5e1',
                '&.active': {
                  bgcolor: 'rgba(59,130,246,0.16)',
                  color: '#fff',
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>{link.label}</Typography>
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4, bgcolor: '#e2e8f0' }}>
        {children}
      </Box>
    </Box>
  )
}
