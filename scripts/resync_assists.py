"""
Re-sync game events to fix missing assists.

After deploying the fix to game_sync.py (assist linking by team instead of player2_name),
run this script to re-sync all games and populate assist_player_id/name on goal events.

Usage:
    # Single game
    docker exec qfl-backend python3 scripts/resync_assists.py 908

    # All games in current season
    docker exec qfl-backend python3 scripts/resync_assists.py --all

    # All games in specific season
    docker exec qfl-backend python3 scripts/resync_assists.py --season 200
"""
import asyncio
import logging
import sys

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)


async def resync_game(game_id: int) -> dict:
    from app.database import async_session
    from app.services.sync import SyncOrchestrator

    async with async_session() as db:
        orch = SyncOrchestrator(db)
        result = await orch.sync_game_events(game_id)
        return result


async def resync_all(season_id: int | None = None) -> None:
    from app.database import async_session
    from app.models import Game
    from sqlalchemy import select, text

    async with async_session() as db:
        if season_id:
            result = await db.execute(
                select(Game.id).where(Game.season_id == season_id, Game.sota_id.isnot(None))
            )
        else:
            result = await db.execute(
                select(Game.id).where(Game.sota_id.isnot(None))
            )
        game_ids = [row[0] for row in result.fetchall()]

    logger.info("Re-syncing %d games...", len(game_ids))
    success = 0
    failed = 0
    assists_linked = 0

    for gid in game_ids:
        try:
            result = await resync_game(gid)
            added = result.get("events_added", 0)
            if added > 0 or "linked" in str(result):
                logger.info("Game %d: %s", gid, result)
                assists_linked += 1
            success += 1
        except Exception as e:
            logger.error("Game %d failed: %s", gid, e)
            failed += 1

    logger.info("Done: %d success, %d failed, %d had new events/assists", success, failed, assists_linked)


async def main():
    args = sys.argv[1:]

    if not args:
        print(__doc__)
        sys.exit(1)

    if args[0] == "--all":
        await resync_all()
    elif args[0] == "--season":
        season_id = int(args[1])
        await resync_all(season_id)
    else:
        game_id = int(args[0])
        result = await resync_game(game_id)
        logger.info("Game %d: %s", game_id, result)


if __name__ == "__main__":
    asyncio.run(main())
