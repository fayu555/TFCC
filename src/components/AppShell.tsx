import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Box, Button, Divider, Drawer, List, ListItemButton, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const links = [
  { label: 'Schedule', to: '/schedule' },
  { label: 'Expenses', to: '/expenses' },
  { label: 'Availability', to: '/availability' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Umpires', to: '/umpires' },
]

const drawerWidth = 280

export function AppShell({ children }: { children: React.ReactNode }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 3 }}>
      <Box sx={{ px: 2, pb: 2 }}>
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
            onClick={() => isMobile && setMobileOpen(false)}
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
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isMobile && (
        <Box
          component="header"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: theme.zIndex.drawer + 1,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#0f172a',
            color: '#f8fafc',
            px: 2,
            py: 1,
            boxShadow: '0 1px 10px rgba(0,0,0,0.2)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            The Force Cricket Club
          </Typography>
          <Button
            onClick={() => setMobileOpen(true)}
            sx={{ color: '#f8fafc', borderColor: 'rgba(248,250,252,0.28)' }}
            variant="outlined"
          >
            ☰
          </Button>
        </Box>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
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
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          bgcolor: '#e2e8f0',
          width: '100%',
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
