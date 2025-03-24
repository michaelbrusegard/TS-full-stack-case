/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SidebarRouteImport } from './routes/_sidebar.route'
import { Route as SidebarIndexImport } from './routes/_sidebar.index'
import { Route as PropertiesNewIndexImport } from './routes/properties.new.index'
import { Route as PropertiesPropertyIdIndexImport } from './routes/properties.$propertyId.index'
import { Route as SidebarPortfolioIdIndexImport } from './routes/_sidebar.$portfolioId.index'
import { Route as PropertiesPropertyIdEditIndexImport } from './routes/properties.$propertyId.edit.index'

// Create/Update Routes

const SidebarRouteRoute = SidebarRouteImport.update({
  id: '/_sidebar',
  getParentRoute: () => rootRoute,
} as any)

const SidebarIndexRoute = SidebarIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => SidebarRouteRoute,
} as any)

const PropertiesNewIndexRoute = PropertiesNewIndexImport.update({
  id: '/properties/new/',
  path: '/properties/new/',
  getParentRoute: () => rootRoute,
} as any)

const PropertiesPropertyIdIndexRoute = PropertiesPropertyIdIndexImport.update({
  id: '/properties/$propertyId/',
  path: '/properties/$propertyId/',
  getParentRoute: () => rootRoute,
} as any)

const SidebarPortfolioIdIndexRoute = SidebarPortfolioIdIndexImport.update({
  id: '/$portfolioId/',
  path: '/$portfolioId/',
  getParentRoute: () => SidebarRouteRoute,
} as any)

const PropertiesPropertyIdEditIndexRoute =
  PropertiesPropertyIdEditIndexImport.update({
    id: '/properties/$propertyId/edit/',
    path: '/properties/$propertyId/edit/',
    getParentRoute: () => rootRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_sidebar': {
      id: '/_sidebar'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof SidebarRouteImport
      parentRoute: typeof rootRoute
    }
    '/_sidebar/': {
      id: '/_sidebar/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof SidebarIndexImport
      parentRoute: typeof SidebarRouteImport
    }
    '/_sidebar/$portfolioId/': {
      id: '/_sidebar/$portfolioId/'
      path: '/$portfolioId'
      fullPath: '/$portfolioId'
      preLoaderRoute: typeof SidebarPortfolioIdIndexImport
      parentRoute: typeof SidebarRouteImport
    }
    '/properties/$propertyId/': {
      id: '/properties/$propertyId/'
      path: '/properties/$propertyId'
      fullPath: '/properties/$propertyId'
      preLoaderRoute: typeof PropertiesPropertyIdIndexImport
      parentRoute: typeof rootRoute
    }
    '/properties/new/': {
      id: '/properties/new/'
      path: '/properties/new'
      fullPath: '/properties/new'
      preLoaderRoute: typeof PropertiesNewIndexImport
      parentRoute: typeof rootRoute
    }
    '/properties/$propertyId/edit/': {
      id: '/properties/$propertyId/edit/'
      path: '/properties/$propertyId/edit'
      fullPath: '/properties/$propertyId/edit'
      preLoaderRoute: typeof PropertiesPropertyIdEditIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

interface SidebarRouteRouteChildren {
  SidebarIndexRoute: typeof SidebarIndexRoute
  SidebarPortfolioIdIndexRoute: typeof SidebarPortfolioIdIndexRoute
}

const SidebarRouteRouteChildren: SidebarRouteRouteChildren = {
  SidebarIndexRoute: SidebarIndexRoute,
  SidebarPortfolioIdIndexRoute: SidebarPortfolioIdIndexRoute,
}

const SidebarRouteRouteWithChildren = SidebarRouteRoute._addFileChildren(
  SidebarRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof SidebarRouteRouteWithChildren
  '/': typeof SidebarIndexRoute
  '/$portfolioId': typeof SidebarPortfolioIdIndexRoute
  '/properties/$propertyId': typeof PropertiesPropertyIdIndexRoute
  '/properties/new': typeof PropertiesNewIndexRoute
  '/properties/$propertyId/edit': typeof PropertiesPropertyIdEditIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof SidebarIndexRoute
  '/$portfolioId': typeof SidebarPortfolioIdIndexRoute
  '/properties/$propertyId': typeof PropertiesPropertyIdIndexRoute
  '/properties/new': typeof PropertiesNewIndexRoute
  '/properties/$propertyId/edit': typeof PropertiesPropertyIdEditIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_sidebar': typeof SidebarRouteRouteWithChildren
  '/_sidebar/': typeof SidebarIndexRoute
  '/_sidebar/$portfolioId/': typeof SidebarPortfolioIdIndexRoute
  '/properties/$propertyId/': typeof PropertiesPropertyIdIndexRoute
  '/properties/new/': typeof PropertiesNewIndexRoute
  '/properties/$propertyId/edit/': typeof PropertiesPropertyIdEditIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/'
    | '/$portfolioId'
    | '/properties/$propertyId'
    | '/properties/new'
    | '/properties/$propertyId/edit'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/$portfolioId'
    | '/properties/$propertyId'
    | '/properties/new'
    | '/properties/$propertyId/edit'
  id:
    | '__root__'
    | '/_sidebar'
    | '/_sidebar/'
    | '/_sidebar/$portfolioId/'
    | '/properties/$propertyId/'
    | '/properties/new/'
    | '/properties/$propertyId/edit/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  SidebarRouteRoute: typeof SidebarRouteRouteWithChildren
  PropertiesPropertyIdIndexRoute: typeof PropertiesPropertyIdIndexRoute
  PropertiesNewIndexRoute: typeof PropertiesNewIndexRoute
  PropertiesPropertyIdEditIndexRoute: typeof PropertiesPropertyIdEditIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  SidebarRouteRoute: SidebarRouteRouteWithChildren,
  PropertiesPropertyIdIndexRoute: PropertiesPropertyIdIndexRoute,
  PropertiesNewIndexRoute: PropertiesNewIndexRoute,
  PropertiesPropertyIdEditIndexRoute: PropertiesPropertyIdEditIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_sidebar",
        "/properties/$propertyId/",
        "/properties/new/",
        "/properties/$propertyId/edit/"
      ]
    },
    "/_sidebar": {
      "filePath": "_sidebar.route.tsx",
      "children": [
        "/_sidebar/",
        "/_sidebar/$portfolioId/"
      ]
    },
    "/_sidebar/": {
      "filePath": "_sidebar.index.tsx",
      "parent": "/_sidebar"
    },
    "/_sidebar/$portfolioId/": {
      "filePath": "_sidebar.$portfolioId.index.tsx",
      "parent": "/_sidebar"
    },
    "/properties/$propertyId/": {
      "filePath": "properties.$propertyId.index.tsx"
    },
    "/properties/new/": {
      "filePath": "properties.new.index.tsx"
    },
    "/properties/$propertyId/edit/": {
      "filePath": "properties.$propertyId.edit.index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
