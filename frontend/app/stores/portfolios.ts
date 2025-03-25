import type { components } from '@/api/schema';
import { Store } from '@tanstack/react-store';

type Portfolio = components['schemas']['Portfolio'];

type PortfoliosState = {
  portfolios: Portfolio[];
};

const sortPortfolios = (portfolios: Portfolio[]) =>
  [...portfolios].sort((a, b) => a.name.localeCompare(b.name));

const portfoliosStore = new Store<PortfoliosState>({
  portfolios: [],
});

const portfolioActions = {
  setPortfolios: (portfolios: Portfolio[]) => {
    portfoliosStore.setState(() => ({
      portfolios: sortPortfolios(portfolios),
    }));
  },

  addPortfolio: (portfolio: Portfolio) => {
    portfoliosStore.setState((state) => ({
      portfolios: sortPortfolios([...state.portfolios, portfolio]),
    }));
  },

  updatePortfolio: (updatedPortfolio: Portfolio) => {
    portfoliosStore.setState((state) => ({
      portfolios: sortPortfolios(
        state.portfolios.map((p) =>
          p.id === updatedPortfolio.id ? updatedPortfolio : p,
        ),
      ),
    }));
  },

  deletePortfolio: (portfolioId: number) => {
    portfoliosStore.setState((state) => ({
      portfolios: state.portfolios.filter((p) => p.id !== portfolioId),
    }));
  },
};

export { portfoliosStore, portfolioActions };
