/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * Source: http://localhost:8000/openapi.json
 * Run: npm run gen:api-types
 */
export type paths = {
    "/api/v1/admin/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Login */
        post: operations["login_api_v1_admin_auth_login_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Logout */
        post: operations["logout_api_v1_admin_auth_logout_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Me */
        get: operations["me_api_v1_admin_auth_me_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Refresh */
        post: operations["refresh_api_v1_admin_auth_refresh_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/championships": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Championships */
        get: operations["list_championships_api_v1_admin_championships_get"];
        put?: never;
        /** Create Championship */
        post: operations["create_championship_api_v1_admin_championships_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/championships/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Championship */
        get: operations["get_championship_api_v1_admin_championships__id__get"];
        put?: never;
        post?: never;
        /** Delete Championship */
        delete: operations["delete_championship_api_v1_admin_championships__id__delete"];
        options?: never;
        head?: never;
        /** Update Championship */
        patch: operations["update_championship_api_v1_admin_championships__id__patch"];
        trace?: never;
    };
    "/api/v1/admin/cities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Cities */
        get: operations["list_cities_api_v1_admin_cities_get"];
        put?: never;
        /** Create City */
        post: operations["create_city_api_v1_admin_cities_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/cities/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete City */
        delete: operations["delete_city_api_v1_admin_cities__id__delete"];
        options?: never;
        head?: never;
        /** Update City */
        patch: operations["update_city_api_v1_admin_cities__id__patch"];
        trace?: never;
    };
    "/api/v1/admin/clubs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Clubs */
        get: operations["list_clubs_api_v1_admin_clubs_get"];
        put?: never;
        /** Create Club */
        post: operations["create_club_api_v1_admin_clubs_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/clubs/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Club */
        get: operations["get_club_api_v1_admin_clubs__id__get"];
        put?: never;
        post?: never;
        /** Delete Club */
        delete: operations["delete_club_api_v1_admin_clubs__id__delete"];
        options?: never;
        head?: never;
        /** Update Club */
        patch: operations["update_club_api_v1_admin_clubs__id__patch"];
        trace?: never;
    };
    "/api/v1/admin/files/{category}/{file_path}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete File */
        delete: operations["delete_file_api_v1_admin_files__category___file_path__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/files/countries/{country_code}/flag": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Upload Country Flag */
        post: operations["upload_country_flag_api_v1_admin_files_countries__country_code__flag_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/files/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Files */
        get: operations["list_files_api_v1_admin_files_list_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/files/teams/{team_name}/logo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Upload Team Logo */
        post: operations["upload_team_logo_api_v1_admin_files_teams__team_name__logo_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/files/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Upload File */
        post: operations["upload_file_api_v1_admin_files_upload_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/news/materials": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Materials */
        get: operations["list_materials_api_v1_admin_news_materials_get"];
        put?: never;
        /** Create Material */
        post: operations["create_material_api_v1_admin_news_materials_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/news/materials/{group_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Material */
        get: operations["get_material_api_v1_admin_news_materials__group_id__get"];
        put?: never;
        post?: never;
        /** Delete Material */
        delete: operations["delete_material_api_v1_admin_news_materials__group_id__delete"];
        options?: never;
        head?: never;
        /** Update Material */
        patch: operations["update_material_api_v1_admin_news_materials__group_id__patch"];
        trace?: never;
    };
    "/api/v1/admin/news/materials/{group_id}/translation/{lang}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create Missing Translation */
        post: operations["create_missing_translation_api_v1_admin_news_materials__group_id__translation__lang__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/live/active-games": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Live Active Games */
        get: operations["live_active_games_api_v1_admin_ops_live_active_games_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/live/events/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Live Events */
        get: operations["live_events_api_v1_admin_ops_live_events__game_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/live/start/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Live Start */
        post: operations["live_start_api_v1_admin_ops_live_start__game_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/live/stop/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Live Stop */
        post: operations["live_stop_api_v1_admin_ops_live_stop__game_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/live/sync-events/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Live Sync Events */
        post: operations["live_sync_events_api_v1_admin_ops_live_sync_events__game_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/live/sync-lineup/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Live Sync Lineup */
        post: operations["live_sync_lineup_api_v1_admin_ops_live_sync_lineup__game_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/sync/all-game-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sync All Game Events */
        post: operations["sync_all_game_events_api_v1_admin_ops_sync_all_game_events_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/sync/finished-lineups-positions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sync Finished Lineups Positions */
        post: operations["sync_finished_lineups_positions_api_v1_admin_ops_sync_finished_lineups_positions_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/sync/full": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sync Full */
        post: operations["sync_full_api_v1_admin_ops_sync_full_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/sync/game-events/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sync Game Events */
        post: operations["sync_game_events_api_v1_admin_ops_sync_game_events__game_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/sync/game-lineup/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sync Game Lineup */
        post: operations["sync_game_lineup_api_v1_admin_ops_sync_game_lineup__game_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/sync/game-stats/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sync Game Stats */
        post: operations["sync_game_stats_api_v1_admin_ops_sync_game_stats__game_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/sync/games": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sync Games */
        post: operations["sync_games_api_v1_admin_ops_sync_games_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/sync/player-season-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sync Player Season Stats */
        post: operations["sync_player_season_stats_api_v1_admin_ops_sync_player_season_stats_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/sync/players": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sync Players */
        post: operations["sync_players_api_v1_admin_ops_sync_players_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/sync/score-table": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sync Score Table */
        post: operations["sync_score_table_api_v1_admin_ops_sync_score_table_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/sync/team-logos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sync Team Logos */
        post: operations["sync_team_logos_api_v1_admin_ops_sync_team_logos_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/sync/team-season-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sync Team Season Stats */
        post: operations["sync_team_season_stats_api_v1_admin_ops_sync_team_season_stats_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/ops/sync/teams": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sync Teams */
        post: operations["sync_teams_api_v1_admin_ops_sync_teams_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/pages/materials": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Materials */
        get: operations["list_materials_api_v1_admin_pages_materials_get"];
        put?: never;
        /** Create Material */
        post: operations["create_material_api_v1_admin_pages_materials_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/pages/materials/{group_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Material */
        get: operations["get_material_api_v1_admin_pages_materials__group_id__get"];
        /** Update Material */
        put: operations["update_material_api_v1_admin_pages_materials__group_id__put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/pages/materials/{group_id}/translation/{lang}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create Missing Translation */
        post: operations["create_missing_translation_api_v1_admin_pages_materials__group_id__translation__lang__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/partners": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Partners */
        get: operations["list_partners_api_v1_admin_partners_get"];
        put?: never;
        /** Create Partner */
        post: operations["create_partner_api_v1_admin_partners_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/partners/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete Partner */
        delete: operations["delete_partner_api_v1_admin_partners__id__delete"];
        options?: never;
        head?: never;
        /** Update Partner */
        patch: operations["update_partner_api_v1_admin_partners__id__patch"];
        trace?: never;
    };
    "/api/v1/admin/players": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Players */
        get: operations["list_players_api_v1_admin_players_get"];
        put?: never;
        /** Create Player */
        post: operations["create_player_api_v1_admin_players_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/players/{player_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Player */
        get: operations["get_player_api_v1_admin_players__player_id__get"];
        put?: never;
        post?: never;
        /** Delete Player */
        delete: operations["delete_player_api_v1_admin_players__player_id__delete"];
        options?: never;
        head?: never;
        /** Update Player */
        patch: operations["update_player_api_v1_admin_players__player_id__patch"];
        trace?: never;
    };
    "/api/v1/admin/players/meta": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Players Meta */
        get: operations["get_players_meta_api_v1_admin_players_meta_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/playoff-brackets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Playoff Brackets */
        get: operations["list_playoff_brackets_api_v1_admin_playoff_brackets_get"];
        put?: never;
        /** Create Playoff Bracket */
        post: operations["create_playoff_bracket_api_v1_admin_playoff_brackets_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/playoff-brackets/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete Playoff Bracket */
        delete: operations["delete_playoff_bracket_api_v1_admin_playoff_brackets__id__delete"];
        options?: never;
        head?: never;
        /** Update Playoff Bracket */
        patch: operations["update_playoff_bracket_api_v1_admin_playoff_brackets__id__patch"];
        trace?: never;
    };
    "/api/v1/admin/stages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Stages */
        get: operations["list_stages_api_v1_admin_stages_get"];
        put?: never;
        /** Create Stage */
        post: operations["create_stage_api_v1_admin_stages_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/stages/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete Stage */
        delete: operations["delete_stage_api_v1_admin_stages__id__delete"];
        options?: never;
        head?: never;
        /** Update Stage */
        patch: operations["update_stage_api_v1_admin_stages__id__patch"];
        trace?: never;
    };
    "/api/v1/admin/team-tournaments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Team Tournaments */
        get: operations["list_team_tournaments_api_v1_admin_team_tournaments_get"];
        put?: never;
        /** Create Team Tournament */
        post: operations["create_team_tournament_api_v1_admin_team_tournaments_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/team-tournaments/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete Team Tournament */
        delete: operations["delete_team_tournament_api_v1_admin_team_tournaments__id__delete"];
        options?: never;
        head?: never;
        /** Update Team Tournament */
        patch: operations["update_team_tournament_api_v1_admin_team_tournaments__id__patch"];
        trace?: never;
    };
    "/api/v1/admin/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Users */
        get: operations["list_users_api_v1_admin_users_get"];
        put?: never;
        /** Create User */
        post: operations["create_user_api_v1_admin_users_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/{user_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update User */
        patch: operations["update_user_api_v1_admin_users__user_id__patch"];
        trace?: never;
    };
    "/api/v1/admin/users/{user_id}/reset-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reset Password */
        post: operations["reset_password_api_v1_admin_users__user_id__reset_password_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/championships": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Championships
         * @description Get all championships sorted by sort_order.
         */
        get: operations["get_championships_api_v1_championships_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/championships/{championship_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Championship
         * @description Get championship by ID.
         */
        get: operations["get_championship_api_v1_championships__championship_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/championships/tree": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Championships Tree
         * @description Get full tree: Championship → Tournaments → Seasons.
         */
        get: operations["get_championships_tree_api_v1_championships_tree_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/cities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Cities
         * @description Get all cities.
         */
        get: operations["get_cities_api_v1_cities_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/clubs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Clubs
         * @description Get all clubs with optional city filter.
         */
        get: operations["get_clubs_api_v1_clubs_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/clubs/{club_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Club
         * @description Get a club with its teams.
         */
        get: operations["get_club_api_v1_clubs__club_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/countries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Countries
         * @description List all countries.
         */
        get: operations["list_countries_api_v1_countries_get"];
        put?: never;
        /**
         * Create Country
         * @description Create a new country.
         */
        post: operations["create_country_api_v1_countries_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/countries/{country_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Country
         * @description Get country by ID.
         */
        get: operations["get_country_api_v1_countries__country_id__get"];
        /**
         * Update Country
         * @description Update a country.
         */
        put: operations["update_country_api_v1_countries__country_id__put"];
        post?: never;
        /**
         * Delete Country
         * @description Soft delete a country (sets is_active=False).
         */
        delete: operations["delete_country_api_v1_countries__country_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/countries/{country_id}/flag": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Country Flag
         * @description Get flag image for a country.
         */
        get: operations["get_country_flag_api_v1_countries__country_id__flag_get"];
        put?: never;
        /**
         * Upload Country Flag
         * @description Upload flag image for a country.
         */
        post: operations["upload_country_flag_api_v1_countries__country_id__flag_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/cup/{season_id}/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Cup Overview
         * @description Aggregated cup overview: current round, groups, bracket, recent/upcoming.
         */
        get: operations["get_cup_overview_api_v1_cup__season_id__overview_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/cup/{season_id}/schedule": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Cup Schedule
         * @description Full schedule grouped by rounds, with optional round filter.
         */
        get: operations["get_cup_schedule_api_v1_cup__season_id__schedule_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/files/{category}/{file_path}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete File
         * @description Delete a file from MinIO storage.
         */
        delete: operations["delete_file_api_v1_files__category___file_path__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/files/download/{category}/{file_path}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Download File
         * @description Download a file from MinIO storage.
         */
        get: operations["download_file_api_v1_files_download__category___file_path__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/files/list": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Files
         * @description List files with optional category filtering.
         */
        get: operations["list_files_api_v1_files_list_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/files/teams/{team_name}/logo": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Team Logo
         * @description Get team logo by team name.
         */
        get: operations["get_team_logo_api_v1_files_teams__team_name__logo_get"];
        put?: never;
        /**
         * Upload Team Logo
         * @description Upload team logo (overwrites existing).
         */
        post: operations["upload_team_logo_api_v1_files_teams__team_name__logo_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/files/teams/logos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Team Logos
         * @description List all team logos.
         */
        get: operations["list_team_logos_api_v1_files_teams_logos_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/files/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload File
         * @description Upload a file to MinIO storage with optional metadata.
         */
        post: operations["upload_file_api_v1_files_upload_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/files/view/{category}/{file_path}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * View File
         * @description View a file in browser (inline). Use for PDF preview.
         */
        get: operations["view_file_api_v1_files_view__category___file_path__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/games": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Games
         * @description Get games with comprehensive filtering and optional date grouping.
         *
         *     Filters:
         *     - season_id: Filter by season (defaults to current season)
         *     - team_id: Filter by single team (home or away)
         *     - team_ids: Filter by multiple teams (home or away) - use ?team_ids=1&team_ids=5
         *     - tour: Filter by single tour/round number
         *     - tours: Filter by multiple tours - use ?tours=18&tours=19&tours=20
         *     - month: Filter by month (1-12, requires year)
         *     - year: Year for month filter
         *     - date_from: Start of date range
         *     - date_to: End of date range
         *     - status: Filter by match status (upcoming, finished, live, all)
         *     - hide_past: Hide matches before today
         *     - group_by_date: Group results by date with formatted labels
         *     - lang: Language for localized fields (kz, ru, en)
         */
        get: operations["get_games_api_v1_games_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/games/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Game
         * @description Get game by ID.
         */
        get: operations["get_game_api_v1_games__game_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/games/{game_id}/lineup": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Game Lineup
         * @description Get pre-game lineup data for a game.
         *     Includes referees, coaches for both teams, and player lineups.
         */
        get: operations["get_game_lineup_api_v1_games__game_id__lineup_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/games/{game_id}/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Game Stats
         * @description Get statistics for a game.
         */
        get: operations["get_game_stats_api_v1_games__game_id__stats_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/live/active-games": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Active Games
         * @description Get list of currently live games.
         */
        get: operations["get_active_games_api_v1_live_active_games_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/live/connections/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Websocket Connections
         * @description Get number of WebSocket connections for a game.
         */
        get: operations["get_websocket_connections_api_v1_live_connections__game_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/live/events/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Game Events
         * @description Get all events for a match.
         */
        get: operations["get_game_events_api_v1_live_events__game_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/live/start/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Start Live Sync
         * @description Start live tracking for a match.
         *
         *     - Syncs lineup if not already done
         *     - Sets is_live=True
         *     - Syncs initial events
         *     - Broadcasts game_started status to connected clients
         */
        post: operations["start_live_sync_api_v1_live_start__game_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/live/stop/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Stop Live Sync
         * @description Stop live tracking for a match.
         *
         *     - Sets is_live=False
         *     - Broadcasts game_ended status to connected clients
         */
        post: operations["stop_live_sync_api_v1_live_stop__game_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/live/sync-events/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync Events
         * @description Sync live events for a match.
         *
         *     Fetches events from SOTA and broadcasts new ones via WebSocket.
         */
        post: operations["sync_events_api_v1_live_sync_events__game_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/live/sync-lineup/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync Lineup
         * @description Sync pre-game lineup for a match.
         *
         *     Fetches lineup from SOTA /em/ endpoints and saves to database.
         */
        post: operations["sync_lineup_api_v1_live_sync_lineup__game_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/news": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get News List
         * @description Get paginated news list.
         */
        get: operations["get_news_list_api_v1_news_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/news/{news_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get News Item
         * @description Get single news article by ID with images from MinIO.
         */
        get: operations["get_news_item_api_v1_news__news_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/news/{news_id}/navigation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get News Navigation
         * @description Get previous and next news articles for navigation.
         */
        get: operations["get_news_navigation_api_v1_news__news_id__navigation_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/news/article-types": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Article Types
         * @description Get count of articles by type.
         */
        get: operations["get_article_types_api_v1_news_article_types_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/news/latest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Latest News
         * @description Get latest news.
         */
        get: operations["get_latest_news_api_v1_news_latest_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/news/slider": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Slider News
         * @description Get news for slider.
         */
        get: operations["get_slider_news_api_v1_news_slider_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Pages
         * @description Get all pages for a language.
         */
        get: operations["get_pages_api_v1_pages_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pages/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Page
         * @description Get page by slug.
         */
        get: operations["get_page_api_v1_pages__slug__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pages/contacts/{language}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Contacts
         * @description Get contacts page.
         */
        get: operations["get_contacts_api_v1_pages_contacts__language__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pages/documents/{language}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Documents
         * @description Get documents page with PDF files from MinIO.
         */
        get: operations["get_documents_api_v1_pages_documents__language__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/pages/leadership/{language}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Leadership
         * @description Get leadership page with photos from MinIO.
         */
        get: operations["get_leadership_api_v1_pages_leadership__language__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/partners": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Partners
         * @description Get partners/sponsors with optional filters.
         */
        get: operations["get_partners_api_v1_partners_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/players": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Players
         * @description Get players, optionally filtered by season and team.
         */
        get: operations["get_players_api_v1_players_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/players/{player_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Player
         * @description Get player by ID.
         */
        get: operations["get_player_api_v1_players__player_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/players/{player_id}/games": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Player Games
         * @description Get games a player participated in.
         */
        get: operations["get_player_games_api_v1_players__player_id__games_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/players/{player_id}/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Player Stats
         * @description Get player statistics for a season.
         *
         *     Returns 50+ metrics from SOTA API v2 including:
         *     - xG, xG per 90
         *     - Goals, assists
         *     - Duels, dribbles, tackles
         *     - Passes, key passes
         *     - And more in extra_stats
         */
        get: operations["get_player_stats_api_v1_players__player_id__stats_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/players/{player_id}/teammates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Player Teammates
         * @description Get teammates of a player from the same team in the current season.
         *     Excludes the player themselves from the result.
         */
        get: operations["get_player_teammates_api_v1_players__player_id__teammates_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/players/{player_id}/tournaments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Player Tournament History
         * @description Get player's tournament history (stats by season).
         *     Returns all seasons where the player has stats.
         */
        get: operations["get_player_tournament_history_api_v1_players__player_id__tournaments_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Seasons
         * @description Get all seasons.
         */
        get: operations["get_seasons_api_v1_seasons_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons/{season_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Season
         * @description Get season by ID.
         */
        get: operations["get_season_api_v1_seasons__season_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons/{season_id}/bracket": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Season Bracket
         * @description Get playoff bracket for a season.
         */
        get: operations["get_season_bracket_api_v1_seasons__season_id__bracket_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons/{season_id}/games": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Season Games
         * @description Get games for a season.
         */
        get: operations["get_season_games_api_v1_seasons__season_id__games_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons/{season_id}/goals-by-period": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Goals By Period
         * @description Get goals grouped by minute periods for a season.
         */
        get: operations["get_goals_by_period_api_v1_seasons__season_id__goals_by_period_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons/{season_id}/groups": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Season Groups
         * @description Get teams grouped by group_name for a season.
         */
        get: operations["get_season_groups_api_v1_seasons__season_id__groups_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons/{season_id}/player-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Player Stats Table
         * @description Get player stats table for a season.
         *
         *     Sort by: goals, assists, xg, shots, passes, key_passes, duels, tackle,
         *     interception, dribble, minutes_played, games_played, yellow_cards,
         *     red_cards, save_shot, dry_match, etc.
         */
        get: operations["get_player_stats_table_api_v1_seasons__season_id__player_stats_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons/{season_id}/results-grid": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Results Grid
         * @description Get results grid - W/D/L for each team in each tour.
         *
         *     Returns a matrix where each team has an array of results for each matchweek.
         */
        get: operations["get_results_grid_api_v1_seasons__season_id__results_grid_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons/{season_id}/stages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Season Stages
         * @description Get stages/tours for a season.
         */
        get: operations["get_season_stages_api_v1_seasons__season_id__stages_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons/{season_id}/stages/{stage_id}/games": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Stage Games
         * @description Get games for a specific stage/tour.
         */
        get: operations["get_stage_games_api_v1_seasons__season_id__stages__stage_id__games_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons/{season_id}/statistics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Season Statistics
         * @description Get aggregated tournament statistics for a season.
         *
         *     Returns match results, attendance, goals, penalties, fouls, and cards.
         */
        get: operations["get_season_statistics_api_v1_seasons__season_id__statistics_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons/{season_id}/sync": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update Season Sync
         * @description Enable or disable SOTA sync for a season. When disabled, local data is source of truth.
         */
        patch: operations["update_season_sync_api_v1_seasons__season_id__sync_patch"];
        trace?: never;
    };
    "/api/v1/seasons/{season_id}/table": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Season Table
         * @description Get league table for a season.
         *
         *     Filters:
         *     - group: Filter by group name (from TeamTournament.group_name)
         *     - tour_from: Starting matchweek (inclusive)
         *     - tour_to: Ending matchweek (inclusive)
         *     - home_away: "home" for home games only, "away" for away games only
         */
        get: operations["get_season_table_api_v1_seasons__season_id__table_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons/{season_id}/team-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Team Stats Table
         * @description Get statistics for all teams in a season.
         *
         *     Sort by: points, goals_scored, goals_conceded, wins, draws, losses,
         *     shots, passes, possession_avg, tackles, fouls, yellow_cards, etc.
         */
        get: operations["get_team_stats_table_api_v1_seasons__season_id__team_stats_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/seasons/{season_id}/teams": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Season Teams
         * @description Get all teams participating in a season.
         */
        get: operations["get_season_teams_api_v1_seasons__season_id__teams_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sync/all-game-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync All Game Events
         * @description Sync events for all games in a season.
         */
        post: operations["sync_all_game_events_api_v1_sync_all_game_events_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sync/full": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync Full
         * @description Perform full data synchronization from SOTA API.
         */
        post: operations["sync_full_api_v1_sync_full_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sync/game-events/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync Game Events
         * @description Sync events (goals, cards, substitutions) for a specific game.
         */
        post: operations["sync_game_events_api_v1_sync_game_events__game_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sync/game-lineup/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync Game Lineup
         * @description Sync pre-game lineup (referees, coaches, lineups) for a specific game.
         */
        post: operations["sync_game_lineup_api_v1_sync_game_lineup__game_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sync/game-stats/{game_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync Game Stats
         * @description Sync statistics for a specific game.
         */
        post: operations["sync_game_stats_api_v1_sync_game_stats__game_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sync/games": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync Games
         * @description Sync games for a specific season.
         */
        post: operations["sync_games_api_v1_sync_games_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sync/player-season-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync Player Season Stats
         * @description Sync player season stats for ALL players from SOTA API v2 (50+ metrics).
         */
        post: operations["sync_player_season_stats_api_v1_sync_player_season_stats_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sync/players": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync Players
         * @description Sync players for a specific season.
         */
        post: operations["sync_players_api_v1_sync_players_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sync/score-table": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync Score Table
         * @description Sync league table for a specific season.
         */
        post: operations["sync_score_table_api_v1_sync_score_table_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sync/team-logos": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync Team Logos
         * @description Sync team logos from MinIO storage to database.
         */
        post: operations["sync_team_logos_api_v1_sync_team_logos_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sync/team-season-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync Team Season Stats
         * @description Sync team season stats for ALL teams from SOTA API v2 (92 metrics).
         */
        post: operations["sync_team_season_stats_api_v1_sync_team_season_stats_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sync/teams": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Sync Teams
         * @description Sync teams from SOTA API.
         */
        post: operations["sync_teams_api_v1_sync_teams_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/teams": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Teams
         * @description Get all teams, optionally filtered by season.
         */
        get: operations["get_teams_api_v1_teams_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/teams/{team_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Team
         * @description Get team by ID.
         */
        get: operations["get_team_api_v1_teams__team_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/teams/{team_id}/coaches": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Team Coaches
         * @description Get coaching staff for a team in a specific season.
         */
        get: operations["get_team_coaches_api_v1_teams__team_id__coaches_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/teams/{team_id}/games": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Team Games
         * @description Get games for a team.
         */
        get: operations["get_team_games_api_v1_teams__team_id__games_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/teams/{team_id}/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Team Overview
         * @description Get aggregated team overview data for the team page.
         */
        get: operations["get_team_overview_api_v1_teams__team_id__overview_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/teams/{team_id}/players": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Team Players
         * @description Get players for a team in a specific season.
         */
        get: operations["get_team_players_api_v1_teams__team_id__players_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/teams/{team_id}/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Team Stats
         * @description Get team statistics for a season from local DB.
         */
        get: operations["get_team_stats_api_v1_teams__team_id__stats_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/teams/{team1_id}/vs/{team2_id}/head-to-head": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Head To Head
         * @description Get comprehensive head-to-head statistics between two teams.
         *
         *     Returns:
         *     - Overall H2H stats (all-time wins/draws/losses)
         *     - Form guide (last 5 matches for each team in current season)
         *     - Season table positions
         *     - Previous meetings between the two teams
         */
        get: operations["get_head_to_head_api_v1_teams__team1_id__vs__team2_id__head_to_head_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Health Check */
        get: operations["health_check_health_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
};
export type webhooks = Record<string, never>;
export type components = {
    schemas: {
        /** AdminChampionshipCreateRequest */
        AdminChampionshipCreateRequest: {
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /** Name */
            name: string;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
            /** Short Name */
            short_name?: string | null;
            /** Short Name En */
            short_name_en?: string | null;
            /** Short Name Kz */
            short_name_kz?: string | null;
            /** Slug */
            slug?: string | null;
            /**
             * Sort Order
             * @default 0
             */
            sort_order: number;
        };
        /** AdminChampionshipResponse */
        AdminChampionshipResponse: {
            /** Id */
            id: number;
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /** Name */
            name: string;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
            /** Short Name */
            short_name?: string | null;
            /** Short Name En */
            short_name_en?: string | null;
            /** Short Name Kz */
            short_name_kz?: string | null;
            /** Slug */
            slug?: string | null;
            /**
             * Sort Order
             * @default 0
             */
            sort_order: number;
        };
        /** AdminChampionshipsListResponse */
        AdminChampionshipsListResponse: {
            /** Items */
            items: components["schemas"]["AdminChampionshipResponse"][];
            /** Total */
            total: number;
        };
        /** AdminChampionshipUpdateRequest */
        AdminChampionshipUpdateRequest: {
            /** Is Active */
            is_active?: boolean | null;
            /** Name */
            name?: string | null;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
            /** Short Name */
            short_name?: string | null;
            /** Short Name En */
            short_name_en?: string | null;
            /** Short Name Kz */
            short_name_kz?: string | null;
            /** Slug */
            slug?: string | null;
            /** Sort Order */
            sort_order?: number | null;
        };
        /** AdminCitiesListResponse */
        AdminCitiesListResponse: {
            /** Items */
            items: components["schemas"]["AdminCityResponse"][];
            /** Total */
            total: number;
        };
        /** AdminCityCreateRequest */
        AdminCityCreateRequest: {
            /** Country Id */
            country_id?: number | null;
            /** Name */
            name: string;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
        };
        /** AdminCityResponse */
        AdminCityResponse: {
            /** Country Id */
            country_id?: number | null;
            /** Id */
            id: number;
            /** Name */
            name: string;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
        };
        /** AdminCityUpdateRequest */
        AdminCityUpdateRequest: {
            /** Country Id */
            country_id?: number | null;
            /** Name */
            name?: string | null;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
        };
        /** AdminClubCreateRequest */
        AdminClubCreateRequest: {
            /** City Id */
            city_id?: number | null;
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name: string;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
            /** Short Name */
            short_name?: string | null;
            /** Stadium Id */
            stadium_id?: number | null;
        };
        /** AdminClubResponse */
        AdminClubResponse: {
            /** City Id */
            city_id?: number | null;
            /** Id */
            id: number;
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name: string;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
            /** Short Name */
            short_name?: string | null;
            /** Stadium Id */
            stadium_id?: number | null;
        };
        /** AdminClubsListResponse */
        AdminClubsListResponse: {
            /** Items */
            items: components["schemas"]["AdminClubResponse"][];
            /** Total */
            total: number;
        };
        /** AdminClubUpdateRequest */
        AdminClubUpdateRequest: {
            /** City Id */
            city_id?: number | null;
            /** Is Active */
            is_active?: boolean | null;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name?: string | null;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
            /** Short Name */
            short_name?: string | null;
            /** Stadium Id */
            stadium_id?: number | null;
        };
        /** AdminMetaCountry */
        AdminMetaCountry: {
            /** Code */
            code?: string | null;
            /** Id */
            id: number;
            /** Name */
            name: string;
        };
        /** AdminMetaSeason */
        AdminMetaSeason: {
            /** Id */
            id: number;
            /** Name */
            name: string;
        };
        /** AdminMetaTeam */
        AdminMetaTeam: {
            /** Id */
            id: number;
            /** Name */
            name: string;
        };
        /** AdminNewsMaterialCreateRequest */
        AdminNewsMaterialCreateRequest: {
            kz: components["schemas"]["AdminNewsTranslationPayload"];
            ru: components["schemas"]["AdminNewsTranslationPayload"];
        };
        /** AdminNewsMaterialListResponse */
        AdminNewsMaterialListResponse: {
            /** Items */
            items: components["schemas"]["AdminNewsMaterialResponse"][];
            /** Total */
            total: number;
        };
        /** AdminNewsMaterialResponse */
        AdminNewsMaterialResponse: {
            /**
             * Group Id
             * Format: uuid
             */
            group_id: string;
            kz: components["schemas"]["AdminNewsTranslationResponse"] | null;
            ru: components["schemas"]["AdminNewsTranslationResponse"] | null;
            /** Updated At */
            updated_at?: string | null;
        };
        /** AdminNewsMaterialUpdateRequest */
        AdminNewsMaterialUpdateRequest: {
            kz?: components["schemas"]["AdminNewsTranslationPayload"] | null;
            ru?: components["schemas"]["AdminNewsTranslationPayload"] | null;
        };
        /** AdminNewsTranslationCreateRequest */
        AdminNewsTranslationCreateRequest: {
            data: components["schemas"]["AdminNewsTranslationPayload"];
        };
        /** AdminNewsTranslationPayload */
        AdminNewsTranslationPayload: {
            /** Article Type */
            article_type?: string | null;
            /** Category */
            category?: string | null;
            /** Content */
            content?: string | null;
            /** Content Text */
            content_text?: string | null;
            /** Excerpt */
            excerpt?: string | null;
            /** Image Url */
            image_url?: string | null;
            /**
             * Is Slider
             * @default false
             */
            is_slider: boolean;
            /** Publish Date */
            publish_date?: string | null;
            /** Slider Order */
            slider_order?: number | null;
            /** Source Url */
            source_url?: string | null;
            /** Title */
            title: string;
            /** Tournament Id */
            tournament_id?: string | null;
            /** Video Url */
            video_url?: string | null;
        };
        /** AdminNewsTranslationResponse */
        AdminNewsTranslationResponse: {
            /** Article Type */
            article_type?: string | null;
            /** Category */
            category?: string | null;
            /** Content */
            content?: string | null;
            /** Content Text */
            content_text?: string | null;
            /** Excerpt */
            excerpt?: string | null;
            /** Id */
            id: number;
            /** Image Url */
            image_url?: string | null;
            /**
             * Is Slider
             * @default false
             */
            is_slider: boolean;
            /**
             * Language
             * @enum {string}
             */
            language: "ru" | "kz";
            /** Publish Date */
            publish_date?: string | null;
            /** Slider Order */
            slider_order?: number | null;
            /** Source Id */
            source_id?: number | null;
            /** Source Url */
            source_url?: string | null;
            /** Title */
            title: string;
            /** Tournament Id */
            tournament_id?: string | null;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Video Url */
            video_url?: string | null;
        };
        /** AdminPageMaterialListResponse */
        AdminPageMaterialListResponse: {
            /** Items */
            items: components["schemas"]["AdminPageMaterialResponse"][];
            /** Total */
            total: number;
        };
        /** AdminPageMaterialResponse */
        AdminPageMaterialResponse: {
            /**
             * Group Id
             * Format: uuid
             */
            group_id: string;
            kz: components["schemas"]["AdminPageTranslationResponse"] | null;
            ru: components["schemas"]["AdminPageTranslationResponse"] | null;
            /** Updated At */
            updated_at?: string | null;
        };
        /** AdminPageMaterialUpdateRequest */
        AdminPageMaterialUpdateRequest: {
            kz?: components["schemas"]["AdminPageTranslationPayload"] | null;
            ru?: components["schemas"]["AdminPageTranslationPayload"] | null;
        };
        /** AdminPageTranslationCreateRequest */
        AdminPageTranslationCreateRequest: {
            data: components["schemas"]["AdminPageTranslationPayload"];
        };
        /** AdminPageTranslationPayload */
        AdminPageTranslationPayload: {
            /** Content */
            content?: string | null;
            /** Content Text */
            content_text?: string | null;
            /** Slug */
            slug: string;
            /** Title */
            title: string;
            /** Url */
            url?: string | null;
        };
        /** AdminPageTranslationResponse */
        AdminPageTranslationResponse: {
            /** Content */
            content?: string | null;
            /** Content Text */
            content_text?: string | null;
            /** Id */
            id: number;
            /**
             * Language
             * @enum {string}
             */
            language: "ru" | "kz";
            /** Slug */
            slug: string;
            /** Title */
            title: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Url */
            url?: string | null;
        };
        /** AdminPartnerCreateRequest */
        AdminPartnerCreateRequest: {
            /** Championship Id */
            championship_id?: number | null;
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name: string;
            /** Season Id */
            season_id?: number | null;
            /**
             * Show In News
             * @default false
             */
            show_in_news: boolean;
            /**
             * Sort Order
             * @default 0
             */
            sort_order: number;
            /** Website */
            website?: string | null;
        };
        /** AdminPartnerResponse */
        AdminPartnerResponse: {
            /** Championship Id */
            championship_id?: number | null;
            /** Id */
            id: number;
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name: string;
            /** Season Id */
            season_id?: number | null;
            /**
             * Show In News
             * @default false
             */
            show_in_news: boolean;
            /**
             * Sort Order
             * @default 0
             */
            sort_order: number;
            /** Website */
            website?: string | null;
        };
        /** AdminPartnersListResponse */
        AdminPartnersListResponse: {
            /** Items */
            items: components["schemas"]["AdminPartnerResponse"][];
            /** Total */
            total: number;
        };
        /** AdminPartnerUpdateRequest */
        AdminPartnerUpdateRequest: {
            /** Championship Id */
            championship_id?: number | null;
            /** Is Active */
            is_active?: boolean | null;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name?: string | null;
            /** Season Id */
            season_id?: number | null;
            /** Show In News */
            show_in_news?: boolean | null;
            /** Sort Order */
            sort_order?: number | null;
            /** Website */
            website?: string | null;
        };
        /** AdminPasswordResetRequest */
        AdminPasswordResetRequest: {
            /** New Password */
            new_password: string;
        };
        /** AdminPlayerCreateRequest */
        AdminPlayerCreateRequest: {
            /** Age */
            age?: number | null;
            /** Birthday */
            birthday?: string | null;
            /** Country Id */
            country_id?: number | null;
            /** First Name */
            first_name?: string | null;
            /** First Name En */
            first_name_en?: string | null;
            /** First Name Kz */
            first_name_kz?: string | null;
            /** Last Name */
            last_name?: string | null;
            /** Last Name En */
            last_name_en?: string | null;
            /** Last Name Kz */
            last_name_kz?: string | null;
            /** Photo Url */
            photo_url?: string | null;
            /** Player Type */
            player_type?: string | null;
            /** Sota Id */
            sota_id?: string | null;
            /** Team Bindings */
            team_bindings?: components["schemas"]["AdminPlayerTeamBindingInput"][];
            /** Top Role */
            top_role?: string | null;
            /** Top Role En */
            top_role_en?: string | null;
            /** Top Role Kz */
            top_role_kz?: string | null;
        };
        /** AdminPlayerResponse */
        AdminPlayerResponse: {
            /** Age */
            age?: number | null;
            /** Birthday */
            birthday?: string | null;
            /** Country Id */
            country_id?: number | null;
            /** First Name */
            first_name?: string | null;
            /** First Name En */
            first_name_en?: string | null;
            /** First Name Kz */
            first_name_kz?: string | null;
            /** Id */
            id: number;
            /** Last Name */
            last_name?: string | null;
            /** Last Name En */
            last_name_en?: string | null;
            /** Last Name Kz */
            last_name_kz?: string | null;
            /** Photo Url */
            photo_url?: string | null;
            /** Player Type */
            player_type?: string | null;
            /** Sota Id */
            sota_id?: string | null;
            /** Team Bindings */
            team_bindings?: components["schemas"]["AdminPlayerTeamBindingResponse"][];
            /** Top Role */
            top_role?: string | null;
            /** Top Role En */
            top_role_en?: string | null;
            /** Top Role Kz */
            top_role_kz?: string | null;
        };
        /** AdminPlayersListResponse */
        AdminPlayersListResponse: {
            /** Items */
            items: components["schemas"]["AdminPlayerResponse"][];
            /** Total */
            total: number;
        };
        /** AdminPlayersMetaResponse */
        AdminPlayersMetaResponse: {
            /** Countries */
            countries: components["schemas"]["AdminMetaCountry"][];
            /** Seasons */
            seasons: components["schemas"]["AdminMetaSeason"][];
            /** Teams */
            teams: components["schemas"]["AdminMetaTeam"][];
        };
        /** AdminPlayerTeamBindingInput */
        AdminPlayerTeamBindingInput: {
            /** Number */
            number?: number | null;
            /** Season Id */
            season_id: number;
            /** Team Id */
            team_id: number;
        };
        /** AdminPlayerTeamBindingResponse */
        AdminPlayerTeamBindingResponse: {
            /** Number */
            number?: number | null;
            /** Season Id */
            season_id: number;
            /** Season Name */
            season_name?: string | null;
            /** Team Id */
            team_id: number;
            /** Team Name */
            team_name?: string | null;
        };
        /** AdminPlayerUpdateRequest */
        AdminPlayerUpdateRequest: {
            /** Age */
            age?: number | null;
            /** Birthday */
            birthday?: string | null;
            /** Country Id */
            country_id?: number | null;
            /** First Name */
            first_name?: string | null;
            /** First Name En */
            first_name_en?: string | null;
            /** First Name Kz */
            first_name_kz?: string | null;
            /** Last Name */
            last_name?: string | null;
            /** Last Name En */
            last_name_en?: string | null;
            /** Last Name Kz */
            last_name_kz?: string | null;
            /** Photo Url */
            photo_url?: string | null;
            /** Player Type */
            player_type?: string | null;
            /** Sota Id */
            sota_id?: string | null;
            /** Team Bindings */
            team_bindings?: components["schemas"]["AdminPlayerTeamBindingInput"][] | null;
            /** Top Role */
            top_role?: string | null;
            /** Top Role En */
            top_role_en?: string | null;
            /** Top Role Kz */
            top_role_kz?: string | null;
        };
        /** AdminPlayoffBracketCreateRequest */
        AdminPlayoffBracketCreateRequest: {
            /** Game Id */
            game_id?: string | null;
            /**
             * Is Third Place
             * @default false
             */
            is_third_place: boolean;
            /**
             * Is Visible
             * @default true
             */
            is_visible: boolean;
            /** Round Name */
            round_name: string;
            /** Season Id */
            season_id: number;
            /**
             * Side
             * @default left
             */
            side: string;
            /**
             * Sort Order
             * @default 1
             */
            sort_order: number;
        };
        /** AdminPlayoffBracketResponse */
        AdminPlayoffBracketResponse: {
            /** Game Id */
            game_id?: string | null;
            /** Id */
            id: number;
            /**
             * Is Third Place
             * @default false
             */
            is_third_place: boolean;
            /**
             * Is Visible
             * @default true
             */
            is_visible: boolean;
            /** Round Name */
            round_name: string;
            /** Season Id */
            season_id: number;
            /**
             * Side
             * @default left
             */
            side: string;
            /**
             * Sort Order
             * @default 1
             */
            sort_order: number;
        };
        /** AdminPlayoffBracketsListResponse */
        AdminPlayoffBracketsListResponse: {
            /** Items */
            items: components["schemas"]["AdminPlayoffBracketResponse"][];
            /** Total */
            total: number;
        };
        /** AdminPlayoffBracketUpdateRequest */
        AdminPlayoffBracketUpdateRequest: {
            /** Game Id */
            game_id?: string | null;
            /** Is Third Place */
            is_third_place?: boolean | null;
            /** Is Visible */
            is_visible?: boolean | null;
            /** Round Name */
            round_name?: string | null;
            /** Side */
            side?: string | null;
            /** Sort Order */
            sort_order?: number | null;
        };
        /** AdminStageCreateRequest */
        AdminStageCreateRequest: {
            /** Name */
            name: string;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
            /** Season Id */
            season_id: number;
            /**
             * Sort Order
             * @default 0
             */
            sort_order: number;
            /** Stage Number */
            stage_number?: number | null;
        };
        /** AdminStageResponse */
        AdminStageResponse: {
            /** Id */
            id: number;
            /** Name */
            name: string;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
            /** Season Id */
            season_id: number;
            /**
             * Sort Order
             * @default 0
             */
            sort_order: number;
            /** Stage Number */
            stage_number?: number | null;
        };
        /** AdminStagesListResponse */
        AdminStagesListResponse: {
            /** Items */
            items: components["schemas"]["AdminStageResponse"][];
            /** Total */
            total: number;
        };
        /** AdminStageUpdateRequest */
        AdminStageUpdateRequest: {
            /** Name */
            name?: string | null;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
            /** Sort Order */
            sort_order?: number | null;
            /** Stage Number */
            stage_number?: number | null;
        };
        /** AdminTeamTournamentCreateRequest */
        AdminTeamTournamentCreateRequest: {
            /**
             * Fine Points
             * @default 0
             */
            fine_points: number;
            /** Group Name */
            group_name?: string | null;
            /**
             * Is Disqualified
             * @default false
             */
            is_disqualified: boolean;
            /** Season Id */
            season_id: number;
            /**
             * Sort Order
             * @default 0
             */
            sort_order: number;
            /** Stadium Id */
            stadium_id?: number | null;
            /** Team Id */
            team_id: number;
        };
        /** AdminTeamTournamentResponse */
        AdminTeamTournamentResponse: {
            /**
             * Fine Points
             * @default 0
             */
            fine_points: number;
            /** Group Name */
            group_name?: string | null;
            /** Id */
            id: number;
            /**
             * Is Disqualified
             * @default false
             */
            is_disqualified: boolean;
            /** Season Id */
            season_id: number;
            /**
             * Sort Order
             * @default 0
             */
            sort_order: number;
            /** Stadium Id */
            stadium_id?: number | null;
            /** Team Id */
            team_id: number;
        };
        /** AdminTeamTournamentsListResponse */
        AdminTeamTournamentsListResponse: {
            /** Items */
            items: components["schemas"]["AdminTeamTournamentResponse"][];
            /** Total */
            total: number;
        };
        /** AdminTeamTournamentUpdateRequest */
        AdminTeamTournamentUpdateRequest: {
            /** Fine Points */
            fine_points?: number | null;
            /** Group Name */
            group_name?: string | null;
            /** Is Disqualified */
            is_disqualified?: boolean | null;
            /** Sort Order */
            sort_order?: number | null;
            /** Stadium Id */
            stadium_id?: number | null;
        };
        /** AdminUserCreateRequest */
        AdminUserCreateRequest: {
            /** Email */
            email: string;
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /** Password */
            password: string;
            /**
             * Role
             * @enum {string}
             */
            role: "superadmin" | "editor" | "operator";
        };
        /** AdminUserResponse */
        AdminUserResponse: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Email */
            email: string;
            /** Id */
            id: number;
            /** Is Active */
            is_active: boolean;
            /**
             * Role
             * @enum {string}
             */
            role: "superadmin" | "editor" | "operator";
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** AdminUserUpdateRequest */
        AdminUserUpdateRequest: {
            /** Email */
            email?: string | null;
            /** Is Active */
            is_active?: boolean | null;
            /** Role */
            role?: ("superadmin" | "editor" | "operator") | null;
        };
        /** AuthUserResponse */
        AuthUserResponse: {
            /** Email */
            email: string;
            /** Id */
            id: number;
            /** Is Active */
            is_active: boolean;
            /**
             * Role
             * @enum {string}
             */
            role: "superadmin" | "editor" | "operator";
        };
        /** Body_upload_country_flag_api_v1_admin_files_countries__country_code__flag_post */
        Body_upload_country_flag_api_v1_admin_files_countries__country_code__flag_post: {
            /**
             * File
             * Format: binary
             */
            file: string;
        };
        /** Body_upload_country_flag_api_v1_countries__country_id__flag_post */
        Body_upload_country_flag_api_v1_countries__country_id__flag_post: {
            /**
             * File
             * Format: binary
             */
            file: string;
        };
        /** Body_upload_file_api_v1_admin_files_upload_post */
        Body_upload_file_api_v1_admin_files_upload_post: {
            /**
             * File
             * Format: binary
             */
            file: string;
        };
        /** Body_upload_file_api_v1_files_upload_post */
        Body_upload_file_api_v1_files_upload_post: {
            /**
             * File
             * Format: binary
             */
            file: string;
        };
        /** Body_upload_team_logo_api_v1_admin_files_teams__team_name__logo_post */
        Body_upload_team_logo_api_v1_admin_files_teams__team_name__logo_post: {
            /**
             * File
             * Format: binary
             */
            file: string;
        };
        /** Body_upload_team_logo_api_v1_files_teams__team_name__logo_post */
        Body_upload_team_logo_api_v1_files_teams__team_name__logo_post: {
            /**
             * File
             * Format: binary
             */
            file: string;
        };
        /** BracketGameBrief */
        BracketGameBrief: {
            /** Away Penalty Score */
            away_penalty_score?: number | null;
            /** Away Score */
            away_score?: number | null;
            away_team?: components["schemas"]["BracketGameTeam"] | null;
            /**
             * Date
             * Format: date
             */
            date: string;
            /** Home Penalty Score */
            home_penalty_score?: number | null;
            /** Home Score */
            home_score?: number | null;
            home_team?: components["schemas"]["BracketGameTeam"] | null;
            /** Id */
            id: number;
            /** Status */
            status?: string | null;
            /** Time */
            time?: string | null;
        };
        /** BracketGameTeam */
        BracketGameTeam: {
            /** Id */
            id: number;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name: string;
        };
        /** ChampionshipListResponse */
        ChampionshipListResponse: {
            /** Items */
            items: components["schemas"]["ChampionshipResponse"][];
            /** Total */
            total: number;
        };
        /** ChampionshipResponse */
        ChampionshipResponse: {
            /** Id */
            id: number;
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /** Name */
            name: string;
            /** Short Name */
            short_name?: string | null;
            /** Slug */
            slug?: string | null;
            /**
             * Sort Order
             * @default 0
             */
            sort_order: number;
        };
        /** ChampionshipTreeListResponse */
        ChampionshipTreeListResponse: {
            /** Items */
            items: components["schemas"]["ChampionshipTreeResponse"][];
            /** Total */
            total: number;
        };
        /** ChampionshipTreeResponse */
        ChampionshipTreeResponse: {
            /** Id */
            id: number;
            /** Name */
            name: string;
            /** Short Name */
            short_name?: string | null;
            /** Slug */
            slug?: string | null;
            /**
             * Tournaments
             * @default []
             */
            tournaments: components["schemas"]["TournamentInChampionship"][];
        };
        /** CityListResponse */
        CityListResponse: {
            /** Items */
            items: components["schemas"]["CityResponse"][];
            /** Total */
            total: number;
        };
        /** CityResponse */
        CityResponse: {
            /** Country Id */
            country_id?: number | null;
            /** Country Name */
            country_name?: string | null;
            /** Id */
            id: number;
            /** Name */
            name: string;
        };
        /** ClubListResponse */
        ClubListResponse: {
            /** Items */
            items: components["schemas"]["ClubResponse"][];
            /** Total */
            total: number;
        };
        /** ClubResponse */
        ClubResponse: {
            /** City Name */
            city_name?: string | null;
            /** Id */
            id: number;
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name: string;
            /** Short Name */
            short_name?: string | null;
        };
        /** ClubWithTeamsResponse */
        ClubWithTeamsResponse: {
            /** City Name */
            city_name?: string | null;
            /** Id */
            id: number;
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name: string;
            /** Short Name */
            short_name?: string | null;
            /**
             * Teams
             * @default []
             */
            teams: components["schemas"]["TeamBrief"][];
        };
        /** CountryCreate */
        CountryCreate: {
            /**
             * Code
             * @description ISO 3166-1 alpha-2 code
             */
            code: string;
            /**
             * Name
             * @description Country name in Russian
             */
            name: string;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
        };
        /**
         * CountryInPlayer
         * @description Minimal country info for nested responses (player, coach, referee).
         */
        CountryInPlayer: {
            /** Code */
            code: string;
            /** Flag Url */
            flag_url?: string | null;
            /** Id */
            id: number;
            /** Name */
            name: string;
        };
        /** CountryListResponse */
        CountryListResponse: {
            /** Items */
            items: components["schemas"]["CountryResponse"][];
            /** Total */
            total: number;
        };
        /** CountryResponse */
        CountryResponse: {
            /**
             * Code
             * @description ISO 3166-1 alpha-2 code
             */
            code: string;
            /** Flag Url */
            flag_url?: string | null;
            /** Id */
            id: number;
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /**
             * Name
             * @description Country name in Russian
             */
            name: string;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
        };
        /** CountryUpdate */
        CountryUpdate: {
            /** Code */
            code?: string | null;
            /** Name */
            name?: string | null;
            /** Name En */
            name_en?: string | null;
            /** Name Kz */
            name_kz?: string | null;
        };
        /** CupGameBrief */
        CupGameBrief: {
            /** Away Penalty Score */
            away_penalty_score?: number | null;
            /** Away Score */
            away_score?: number | null;
            away_team?: components["schemas"]["CupTeamBrief"] | null;
            /**
             * Date
             * Format: date
             */
            date: string;
            /** Home Penalty Score */
            home_penalty_score?: number | null;
            /** Home Score */
            home_score?: number | null;
            home_team?: components["schemas"]["CupTeamBrief"] | null;
            /** Id */
            id: number;
            /**
             * Is Live
             * @default false
             */
            is_live: boolean;
            /** Stage Name */
            stage_name?: string | null;
            /** Status */
            status?: string | null;
            /** Time */
            time?: string | null;
        };
        /** CupGroup */
        CupGroup: {
            /** Group Name */
            group_name: string;
            /** Standings */
            standings: components["schemas"]["CupGroupStandingEntry"][];
        };
        /** CupGroupStandingEntry */
        CupGroupStandingEntry: {
            /**
             * Draws
             * @default 0
             */
            draws: number;
            /**
             * Games Played
             * @default 0
             */
            games_played: number;
            /**
             * Goal Difference
             * @default 0
             */
            goal_difference: number;
            /**
             * Goals Conceded
             * @default 0
             */
            goals_conceded: number;
            /**
             * Goals Scored
             * @default 0
             */
            goals_scored: number;
            /**
             * Losses
             * @default 0
             */
            losses: number;
            /**
             * Points
             * @default 0
             */
            points: number;
            /** Position */
            position: number;
            /** Team Id */
            team_id: number;
            /** Team Logo */
            team_logo?: string | null;
            /** Team Name */
            team_name?: string | null;
            /**
             * Wins
             * @default 0
             */
            wins: number;
        };
        /** CupOverviewResponse */
        CupOverviewResponse: {
            bracket?: components["schemas"]["PlayoffBracketResponse"] | null;
            /** Championship Name */
            championship_name?: string | null;
            current_round?: components["schemas"]["CupRound"] | null;
            /** Groups */
            groups?: components["schemas"]["CupGroup"][] | null;
            /**
             * Recent Results
             * @default []
             */
            recent_results: components["schemas"]["CupGameBrief"][];
            /**
             * Rounds
             * @default []
             */
            rounds: components["schemas"]["CupRound"][];
            /** Season Id */
            season_id: number;
            /** Season Name */
            season_name?: string | null;
            /** Tournament Name */
            tournament_name?: string | null;
            /**
             * Upcoming Games
             * @default []
             */
            upcoming_games: components["schemas"]["CupGameBrief"][];
        };
        /** CupRound */
        CupRound: {
            /**
             * Games
             * @default []
             */
            games: components["schemas"]["CupGameBrief"][];
            /**
             * Is Current
             * @default false
             */
            is_current: boolean;
            /**
             * Played Games
             * @default 0
             */
            played_games: number;
            /** Round Key */
            round_key: string;
            /** Round Name */
            round_name: string;
            /** Stage Id */
            stage_id?: number | null;
            /**
             * Total Games
             * @default 0
             */
            total_games: number;
        };
        /** CupScheduleResponse */
        CupScheduleResponse: {
            /** Rounds */
            rounds: components["schemas"]["CupRound"][];
            /** Season Id */
            season_id: number;
            /**
             * Total Games
             * @default 0
             */
            total_games: number;
        };
        /** CupTeamBrief */
        CupTeamBrief: {
            /** Id */
            id: number;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name: string;
        };
        /** FileUploadResponse */
        FileUploadResponse: {
            /** Category */
            category: string;
            /** Content Type */
            content_type: string;
            /** File Id */
            file_id: string;
            /** Filename */
            filename: string;
            /** Object Name */
            object_name: string;
            /** Size */
            size: number;
            /** Url */
            url: string;
        };
        /** FinishedLineupsBackfillRequest */
        FinishedLineupsBackfillRequest: {
            /** Game Ids */
            game_ids?: string[] | null;
        };
        /**
         * GameEventResponse
         * @description Response schema for a match event.
         */
        GameEventResponse: {
            /** Assist Player Id */
            assist_player_id?: number | null;
            /** Assist Player Name */
            assist_player_name?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            event_type: components["schemas"]["GameEventType"];
            /** Game Id */
            game_id: number;
            /** Half */
            half: number;
            /** Id */
            id: number;
            /** Minute */
            minute: number;
            /** Player Id */
            player_id?: number | null;
            /** Player Name */
            player_name?: string | null;
            /** Player Number */
            player_number?: number | null;
            /** Player2 Id */
            player2_id?: number | null;
            /** Player2 Name */
            player2_name?: string | null;
            /** Player2 Number */
            player2_number?: number | null;
            /** Player2 Team Name */
            player2_team_name?: string | null;
            /** Team Id */
            team_id?: number | null;
            /** Team Name */
            team_name?: string | null;
        };
        /**
         * GameEventsListResponse
         * @description Response with list of game events.
         */
        GameEventsListResponse: {
            /** Events */
            events: components["schemas"]["GameEventResponse"][];
            /** Game Id */
            game_id: number;
            /** Total */
            total: number;
        };
        /**
         * GameEventType
         * @description Types of match events.
         * @enum {string}
         */
        GameEventType: "goal" | "assist" | "yellow_card" | "red_card" | "substitution";
        /** GameListResponse */
        GameListResponse: {
            /** Items */
            items: components["schemas"]["GameResponse"][];
            /** Total */
            total: number;
        };
        /** GameResponse */
        GameResponse: {
            /** Away Penalty Score */
            away_penalty_score?: number | null;
            /** Away Score */
            away_score?: number | null;
            away_team?: components["schemas"]["TeamInGame"] | null;
            /**
             * Date
             * Format: date
             */
            date: string;
            /**
             * Has Score
             * @default false
             */
            has_score: boolean;
            /**
             * Has Stats
             * @default false
             */
            has_stats: boolean;
            /** Home Penalty Score */
            home_penalty_score?: number | null;
            /** Home Score */
            home_score?: number | null;
            home_team?: components["schemas"]["TeamInGame"] | null;
            /** Id */
            id: number;
            /** Protocol Url */
            protocol_url?: string | null;
            /** Season Id */
            season_id?: number | null;
            /** Season Name */
            season_name?: string | null;
            /** Stadium */
            stadium?: string | null;
            /** Stage Id */
            stage_id?: number | null;
            /** Stage Name */
            stage_name?: string | null;
            /** Status */
            status?: string | null;
            /** Time */
            time?: string | null;
            /** Tour */
            tour?: number | null;
            /** Tournament Name */
            tournament_name?: string | null;
            /** Video Url */
            video_url?: string | null;
            /** Visitors */
            visitors?: number | null;
        };
        /**
         * GoalPeriodItem
         * @description Goals grouped by minute period.
         */
        GoalPeriodItem: {
            /**
             * Away
             * @default 0
             */
            away: number;
            /**
             * Goals
             * @default 0
             */
            goals: number;
            /**
             * Home
             * @default 0
             */
            home: number;
            /** Period */
            period: string;
        };
        /**
         * GoalsByPeriodMeta
         * @description Data quality metadata for goals-by-period chart.
         */
        GoalsByPeriodMeta: {
            /**
             * Coverage Pct
             * @default 0
             */
            coverage_pct: number;
            /**
             * Matches Played
             * @default 0
             */
            matches_played: number;
            /**
             * Matches With Goal Events
             * @default 0
             */
            matches_with_goal_events: number;
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /**
         * LineupSyncResponse
         * @description Response for lineup sync operation.
         */
        LineupSyncResponse: {
            /** Away Formation */
            away_formation?: string | null;
            /** Error */
            error?: string | null;
            /** Game Id */
            game_id: number;
            /** Home Formation */
            home_formation?: string | null;
            /** Lineup Count */
            lineup_count: number;
        };
        /**
         * LiveSyncResponse
         * @description Response for live sync operations.
         */
        LiveSyncResponse: {
            /** Error */
            error?: string | null;
            /** Game Id */
            game_id: number;
            /** Is Live */
            is_live?: boolean | null;
            /** New Events Count */
            new_events_count?: number | null;
        };
        /** LoginRequest */
        LoginRequest: {
            /** Email */
            email: string;
            /** Password */
            password: string;
        };
        /** LoginResponse */
        LoginResponse: {
            /** Access Token */
            access_token: string;
            /**
             * Token Type
             * @default bearer
             */
            token_type: string;
            user: components["schemas"]["AuthUserResponse"];
        };
        /** MeResponse */
        MeResponse: {
            /** Email */
            email: string;
            /** Id */
            id: number;
            /** Is Active */
            is_active: boolean;
            /**
             * Role
             * @enum {string}
             */
            role: "superadmin" | "editor" | "operator";
        };
        /** NewsListItem */
        NewsListItem: {
            /** Article Type */
            article_type?: string | null;
            /** Excerpt */
            excerpt?: string | null;
            /** Id */
            id: number;
            /** Image Url */
            image_url?: string | null;
            /**
             * Is Slider
             * @default false
             */
            is_slider: boolean;
            /** Language */
            language: string;
            /** Publish Date */
            publish_date?: string | null;
            /** Slider Order */
            slider_order?: number | null;
            /** Title */
            title: string;
            /** Tournament Id */
            tournament_id?: string | null;
        };
        /** NewsListResponse */
        NewsListResponse: {
            /** Items */
            items: components["schemas"]["NewsListItem"][];
            /** Page */
            page: number;
            /** Pages */
            pages: number;
            /** Per Page */
            per_page: number;
            /** Total */
            total: number;
        };
        /** PageListResponse */
        PageListResponse: {
            /** Language */
            language: string;
            /** Slug */
            slug: string;
            /** Title */
            title: string;
            /** Url */
            url?: string | null;
        };
        /** PageResponse */
        PageResponse: {
            /** Content */
            content?: string | null;
            /** Content Text */
            content_text?: string | null;
            /** Id */
            id: number;
            /** Language */
            language: string;
            /** Slug */
            slug: string;
            /** Structured Data */
            structured_data?: Record<string, never> | null;
            /** Title */
            title: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Url */
            url?: string | null;
        };
        /** PartnerListResponse */
        PartnerListResponse: {
            /** Items */
            items: components["schemas"]["PartnerResponse"][];
            /** Total */
            total: number;
        };
        /** PartnerResponse */
        PartnerResponse: {
            /** Id */
            id: number;
            /**
             * Is Active
             * @default true
             */
            is_active: boolean;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name: string;
            /**
             * Sort Order
             * @default 0
             */
            sort_order: number;
            /** Website */
            website?: string | null;
        };
        /** PlayerListResponse */
        PlayerListResponse: {
            /** Items */
            items: components["schemas"]["PlayerResponse"][];
            /** Total */
            total: number;
        };
        /** PlayerResponse */
        PlayerResponse: {
            /** Age */
            age?: number | null;
            /** Birthday */
            birthday?: string | null;
            country?: components["schemas"]["CountryInPlayer"] | null;
            /** First Name */
            first_name?: string | null;
            /** Id */
            id: number;
            /** Last Name */
            last_name?: string | null;
            /** Photo Url */
            photo_url?: string | null;
            /** Player Type */
            player_type?: string | null;
            /** Top Role */
            top_role?: string | null;
        };
        /** PlayerSeasonStatsResponse */
        PlayerSeasonStatsResponse: {
            /** Assists */
            assists?: number | null;
            /** Duels */
            duels?: number | null;
            /** Duels Won */
            duels_won?: number | null;
            /** Extra Stats */
            extra_stats?: Record<string, never> | null;
            /** Games Played */
            games_played?: number | null;
            /** Games Starting */
            games_starting?: number | null;
            /** Goals */
            goals?: number | null;
            /** Key Passes */
            key_passes?: number | null;
            /** Minutes Played */
            minutes_played?: number | null;
            /** Pass Accuracy */
            pass_accuracy?: number | null;
            /** Passes */
            passes?: number | null;
            /** Player Id */
            player_id: number;
            /** Red Cards */
            red_cards?: number | null;
            /** Season Id */
            season_id: number;
            /** Shots */
            shots?: number | null;
            /** Shots On Goal */
            shots_on_goal?: number | null;
            /** Team Id */
            team_id?: number | null;
            /** Xg */
            xg?: number | null;
            /** Xg Per 90 */
            xg_per_90?: number | null;
            /** Yellow Cards */
            yellow_cards?: number | null;
        };
        /**
         * PlayerStatsTableEntry
         * @description Single entry in player stats table.
         */
        PlayerStatsTableEntry: {
            /** Aerial Duel */
            aerial_duel?: number | null;
            /** Assists */
            assists?: number | null;
            country?: components["schemas"]["CountryInPlayer"] | null;
            /** Dribble */
            dribble?: number | null;
            /** Dribble Success */
            dribble_success?: number | null;
            /** Dry Match */
            dry_match?: number | null;
            /** Duels */
            duels?: number | null;
            /** Duels Won */
            duels_won?: number | null;
            /** First Name */
            first_name?: string | null;
            /** Games Played */
            games_played?: number | null;
            /** Goal And Assist */
            goal_and_assist?: number | null;
            /** Goals */
            goals?: number | null;
            /** Ground Duel */
            ground_duel?: number | null;
            /** Interception */
            interception?: number | null;
            /** Key Passes */
            key_passes?: number | null;
            /** Last Name */
            last_name?: string | null;
            /** Minutes Played */
            minutes_played?: number | null;
            /** Pass Accuracy */
            pass_accuracy?: number | null;
            /** Passes */
            passes?: number | null;
            /** Photo Url */
            photo_url?: string | null;
            /** Player Id */
            player_id: number;
            /** Player Type */
            player_type?: string | null;
            /** Position Code */
            position_code?: string | null;
            /** Recovery */
            recovery?: number | null;
            /** Red Cards */
            red_cards?: number | null;
            /** Save Shot */
            save_shot?: number | null;
            /** Shots */
            shots?: number | null;
            /** Shots On Goal */
            shots_on_goal?: number | null;
            /** Tackle */
            tackle?: number | null;
            /** Team Id */
            team_id?: number | null;
            /** Team Logo */
            team_logo?: string | null;
            /** Team Name */
            team_name?: string | null;
            /** Top Role */
            top_role?: string | null;
            /** Xg */
            xg?: number | null;
            /** Yellow Cards */
            yellow_cards?: number | null;
        };
        /**
         * PlayerStatsTableResponse
         * @description Response for player stats table endpoint.
         */
        PlayerStatsTableResponse: {
            /** Items */
            items: components["schemas"]["PlayerStatsTableEntry"][];
            /** Season Id */
            season_id: number;
            /** Sort By */
            sort_by: string;
            /** Total */
            total: number;
        };
        /**
         * PlayerTeammateResponse
         * @description Response for player teammate.
         */
        PlayerTeammateResponse: {
            /** Age */
            age?: number | null;
            /** First Name */
            first_name?: string | null;
            /** Jersey Number */
            jersey_number?: number | null;
            /** Last Name */
            last_name?: string | null;
            /** Photo Url */
            photo_url?: string | null;
            /** Player Id */
            player_id: number;
            /** Position */
            position?: string | null;
        };
        /**
         * PlayerTeammatesListResponse
         * @description Response for player teammates list.
         */
        PlayerTeammatesListResponse: {
            /** Items */
            items: components["schemas"]["PlayerTeammateResponse"][];
            /** Total */
            total: number;
        };
        /**
         * PlayerTournamentHistoryEntry
         * @description Single entry in player tournament history.
         */
        PlayerTournamentHistoryEntry: {
            /** Assists */
            assists?: number | null;
            /** Games Played */
            games_played?: number | null;
            /** Goals */
            goals?: number | null;
            /** Minutes Played */
            minutes_played?: number | null;
            /** Position */
            position?: string | null;
            /** Red Cards */
            red_cards?: number | null;
            /** Season Id */
            season_id: number;
            /** Season Name */
            season_name?: string | null;
            /** Team Id */
            team_id?: number | null;
            /** Team Name */
            team_name?: string | null;
            /** Tournament Name */
            tournament_name?: string | null;
            /** Yellow Cards */
            yellow_cards?: number | null;
        };
        /**
         * PlayerTournamentHistoryResponse
         * @description Response for player tournament history.
         */
        PlayerTournamentHistoryResponse: {
            /** Items */
            items: components["schemas"]["PlayerTournamentHistoryEntry"][];
            /** Total */
            total: number;
        };
        /** PlayoffBracketEntry */
        PlayoffBracketEntry: {
            game?: components["schemas"]["BracketGameBrief"] | null;
            /** Id */
            id: number;
            /**
             * Is Third Place
             * @default false
             */
            is_third_place: boolean;
            /** Round Name */
            round_name: string;
            /**
             * Side
             * @default left
             */
            side: string;
            /**
             * Sort Order
             * @default 1
             */
            sort_order: number;
        };
        /** PlayoffBracketResponse */
        PlayoffBracketResponse: {
            /** Rounds */
            rounds: components["schemas"]["PlayoffRound"][];
            /** Season Id */
            season_id: number;
        };
        /** PlayoffRound */
        PlayoffRound: {
            /** Entries */
            entries: components["schemas"]["PlayoffBracketEntry"][];
            /** Round Label */
            round_label: string;
            /** Round Name */
            round_name: string;
        };
        /** ResultsGridResponse */
        ResultsGridResponse: {
            /** Season Id */
            season_id: number;
            /**
             * Teams
             * @default []
             */
            teams: components["schemas"]["TeamResultsGridEntry"][];
            /** Total Tours */
            total_tours: number;
        };
        /** SeasonBrief */
        SeasonBrief: {
            /** Date End */
            date_end?: string | null;
            /** Date Start */
            date_start?: string | null;
            /** Id */
            id: number;
            /** Name */
            name: string;
            /**
             * Sync Enabled
             * @default true
             */
            sync_enabled: boolean;
        };
        /**
         * SeasonGoalsByPeriodResponse
         * @description Goals by minute buckets for a season.
         */
        SeasonGoalsByPeriodResponse: {
            meta: components["schemas"]["GoalsByPeriodMeta"];
            /**
             * Period Size Minutes
             * @default 15
             */
            period_size_minutes: number;
            /** Periods */
            periods: components["schemas"]["GoalPeriodItem"][];
            /** Season Id */
            season_id: number;
        };
        /** SeasonGroupsResponse */
        SeasonGroupsResponse: {
            /** Groups */
            groups: {
                [key: string]: components["schemas"]["TeamTournamentResponse"][];
            };
            /** Season Id */
            season_id: number;
        };
        /** SeasonListResponse */
        SeasonListResponse: {
            /** Items */
            items: components["schemas"]["SeasonResponse"][];
            /** Total */
            total: number;
        };
        /** SeasonResponse */
        SeasonResponse: {
            /** Championship Name */
            championship_name?: string | null;
            /** Date End */
            date_end?: string | null;
            /** Date Start */
            date_start?: string | null;
            /** Id */
            id: number;
            /** Name */
            name: string;
            /**
             * Sync Enabled
             * @default true
             */
            sync_enabled: boolean;
            /** Tournament Id */
            tournament_id?: number | null;
            /** Tournament Name */
            tournament_name?: string | null;
        };
        /**
         * SeasonStatisticsResponse
         * @description Aggregated statistics for a season (tournament-level).
         */
        SeasonStatisticsResponse: {
            /**
             * Average Attendance
             * @default 0
             */
            average_attendance: number;
            /**
             * Draws
             * @default 0
             */
            draws: number;
            /**
             * Fouls Per Match
             * @default 0
             */
            fouls_per_match: number;
            /**
             * Goals Per Match
             * @default 0
             */
            goals_per_match: number;
            /**
             * Matches Played
             * @default 0
             */
            matches_played: number;
            /**
             * Penalties
             * @default 0
             */
            penalties: number;
            /**
             * Penalties Scored
             * @default 0
             */
            penalties_scored: number;
            /**
             * Red Cards
             * @default 0
             */
            red_cards: number;
            /** Season Id */
            season_id: number;
            /** Season Name */
            season_name?: string | null;
            /**
             * Second Yellow Cards
             * @default 0
             */
            second_yellow_cards: number;
            /**
             * Total Attendance
             * @default 0
             */
            total_attendance: number;
            /**
             * Total Goals
             * @default 0
             */
            total_goals: number;
            /**
             * Wins
             * @default 0
             */
            wins: number;
            /**
             * Yellow Cards
             * @default 0
             */
            yellow_cards: number;
        };
        /** SeasonSyncUpdate */
        SeasonSyncUpdate: {
            /** Sync Enabled */
            sync_enabled: boolean;
        };
        /** StageListResponse */
        StageListResponse: {
            /** Items */
            items: components["schemas"]["StageResponse"][];
            /** Total */
            total: number;
        };
        /** StageResponse */
        StageResponse: {
            /** Id */
            id: number;
            /** Name */
            name: string;
            /** Season Id */
            season_id: number;
            /**
             * Sort Order
             * @default 0
             */
            sort_order: number;
            /** Stage Number */
            stage_number?: number | null;
        };
        /** SyncResponse */
        SyncResponse: {
            /** Details */
            details?: Record<string, never> | null;
            /** Message */
            message: string;
            status: components["schemas"]["SyncStatus"];
        };
        /**
         * SyncStatus
         * @enum {string}
         */
        SyncStatus: "success" | "partial" | "failed";
        /** TeamBrief */
        TeamBrief: {
            /** Id */
            id: number;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name: string;
        };
        /** TeamInGame */
        TeamInGame: {
            /** Accent Color */
            accent_color?: string | null;
            /** Id */
            id: number;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name: string;
            /** Primary Color */
            primary_color?: string | null;
            /** Score */
            score?: number | null;
            /** Secondary Color */
            secondary_color?: string | null;
        };
        /** TeamLogoResponse */
        TeamLogoResponse: {
            /** Content Type */
            content_type: string;
            /** Object Name */
            object_name: string;
            /** Team Name */
            team_name: string;
            /** Url */
            url: string;
        };
        /** TeamOverviewCoachPreview */
        TeamOverviewCoachPreview: {
            /** Country Name */
            country_name?: string | null;
            /** First Name */
            first_name: string;
            /** Id */
            id: number;
            /** Last Name */
            last_name: string;
            /** Photo Url */
            photo_url?: string | null;
            /** Role */
            role: string;
        };
        /** TeamOverviewFormEntry */
        TeamOverviewFormEntry: {
            /** Game Id */
            game_id: number;
            /** Is Home */
            is_home: boolean;
            /** Opponent Logo */
            opponent_logo?: string | null;
            /** Opponent Name */
            opponent_name: string;
            /** Opponent Score */
            opponent_score: number;
            /** Result */
            result: string;
            /** Team Score */
            team_score: number;
        };
        /** TeamOverviewLeaderPlayer */
        TeamOverviewLeaderPlayer: {
            /**
             * Assists
             * @default 0
             */
            assists: number;
            /**
             * Dry Match
             * @default 0
             */
            dry_match: number;
            /** First Name */
            first_name?: string | null;
            /**
             * Games Played
             * @default 0
             */
            games_played: number;
            /**
             * Goals
             * @default 0
             */
            goals: number;
            /** Last Name */
            last_name?: string | null;
            /**
             * Passes
             * @default 0
             */
            passes: number;
            /** Photo Url */
            photo_url?: string | null;
            /** Player Id */
            player_id: number;
            /** Position */
            position?: string | null;
            /**
             * Red Cards
             * @default 0
             */
            red_cards: number;
            /**
             * Save Shot
             * @default 0
             */
            save_shot: number;
            /** Team Id */
            team_id?: number | null;
            /** Team Logo */
            team_logo?: string | null;
            /** Team Name */
            team_name?: string | null;
        };
        /** TeamOverviewLeaders */
        TeamOverviewLeaders: {
            /** Assists Table */
            assists_table: components["schemas"]["TeamOverviewLeaderPlayer"][];
            /** Goals Table */
            goals_table: components["schemas"]["TeamOverviewLeaderPlayer"][];
            mini_leaders: components["schemas"]["TeamOverviewMiniLeaders"];
            top_assister?: components["schemas"]["TeamOverviewLeaderPlayer"] | null;
            top_scorer?: components["schemas"]["TeamOverviewLeaderPlayer"] | null;
        };
        /** TeamOverviewMatch */
        TeamOverviewMatch: {
            /** Away Score */
            away_score?: number | null;
            away_team: components["schemas"]["TeamOverviewMatchTeam"];
            /**
             * Date
             * Format: date
             */
            date: string;
            /**
             * Has Lineup
             * @default false
             */
            has_lineup: boolean;
            /**
             * Has Stats
             * @default false
             */
            has_stats: boolean;
            /** Home Score */
            home_score?: number | null;
            home_team: components["schemas"]["TeamOverviewMatchTeam"];
            /** Id */
            id: number;
            stadium?: components["schemas"]["TeamOverviewStadium"] | null;
            /** Status */
            status: string;
            /** Time */
            time?: string | null;
            /** Tour */
            tour?: number | null;
        };
        /** TeamOverviewMatchTeam */
        TeamOverviewMatchTeam: {
            /** Id */
            id: number;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name: string;
        };
        /** TeamOverviewMiniLeaders */
        TeamOverviewMiniLeaders: {
            appearances?: components["schemas"]["TeamOverviewLeaderPlayer"] | null;
            clean_sheets?: components["schemas"]["TeamOverviewLeaderPlayer"] | null;
            passes?: components["schemas"]["TeamOverviewLeaderPlayer"] | null;
            red_cards?: components["schemas"]["TeamOverviewLeaderPlayer"] | null;
            saves?: components["schemas"]["TeamOverviewLeaderPlayer"] | null;
        };
        /** TeamOverviewResponse */
        TeamOverviewResponse: {
            /** Form Last5 */
            form_last5: components["schemas"]["TeamOverviewFormEntry"][];
            leaders: components["schemas"]["TeamOverviewLeaders"];
            recent_match?: components["schemas"]["TeamOverviewMatch"] | null;
            season?: components["schemas"]["TeamOverviewSeason"] | null;
            /** Staff Preview */
            staff_preview: components["schemas"]["TeamOverviewCoachPreview"][];
            /** Standings Window */
            standings_window: components["schemas"]["TeamOverviewStandingEntry"][];
            summary: components["schemas"]["TeamOverviewSummary"];
            team: components["schemas"]["TeamOverviewTeam"];
            /** Upcoming Matches */
            upcoming_matches: components["schemas"]["TeamOverviewMatch"][];
        };
        /** TeamOverviewSeason */
        TeamOverviewSeason: {
            /** Id */
            id: number;
            /** Name */
            name: string;
            /** Tournament Id */
            tournament_id?: number | null;
        };
        /** TeamOverviewStadium */
        TeamOverviewStadium: {
            /** City */
            city?: string | null;
            /** Name */
            name?: string | null;
        };
        /** TeamOverviewStandingEntry */
        TeamOverviewStandingEntry: {
            /** Games Played */
            games_played: number;
            /** Goal Difference */
            goal_difference: number;
            /** Goals Conceded */
            goals_conceded: number;
            /** Goals Scored */
            goals_scored: number;
            /** Points */
            points: number;
            /** Position */
            position: number;
            /** Team Id */
            team_id: number;
            /** Team Logo */
            team_logo?: string | null;
            /** Team Name */
            team_name: string;
        };
        /** TeamOverviewSummary */
        TeamOverviewSummary: {
            /**
             * Draws
             * @default 0
             */
            draws: number;
            /**
             * Games Played
             * @default 0
             */
            games_played: number;
            /**
             * Goal Difference
             * @default 0
             */
            goal_difference: number;
            /**
             * Goals Conceded
             * @default 0
             */
            goals_conceded: number;
            /**
             * Goals Scored
             * @default 0
             */
            goals_scored: number;
            /**
             * Losses
             * @default 0
             */
            losses: number;
            /**
             * Points
             * @default 0
             */
            points: number;
            /**
             * Wins
             * @default 0
             */
            wins: number;
        };
        /** TeamOverviewTeam */
        TeamOverviewTeam: {
            /** Accent Color */
            accent_color?: string | null;
            /** City */
            city?: string | null;
            /** Id */
            id: number;
            /** Logo Url */
            logo_url?: string | null;
            /** Name */
            name: string;
            /** Primary Color */
            primary_color?: string | null;
            /** Secondary Color */
            secondary_color?: string | null;
            stadium?: components["schemas"]["TeamOverviewStadium"] | null;
            /** Website */
            website?: string | null;
        };
        /** TeamResultsGridEntry */
        TeamResultsGridEntry: {
            /** Position */
            position: number;
            /**
             * Results
             * @default []
             */
            results: (string | null)[];
            /** Team Id */
            team_id: number;
            /** Team Logo */
            team_logo?: string | null;
            /** Team Name */
            team_name?: string | null;
        };
        /** TeamSeasonStatsResponse */
        TeamSeasonStatsResponse: {
            /** Aerial Duel Offence */
            aerial_duel_offence?: number | null;
            /** Aerial Duel Offence Ratio */
            aerial_duel_offence_ratio?: number | null;
            /** Clean Sheets */
            clean_sheets?: number | null;
            /** Corner Per Match */
            corner_per_match?: number | null;
            /** Corners */
            corners?: number | null;
            /** Draws */
            draws?: number | null;
            /** Dribble */
            dribble?: number | null;
            /** Dribble Per Match */
            dribble_per_match?: number | null;
            /** Dribble Ratio */
            dribble_ratio?: number | null;
            /** Duel */
            duel?: number | null;
            /** Duel Ratio */
            duel_ratio?: number | null;
            /** Extra Stats */
            extra_stats?: Record<string, never> | null;
            /** Foul Taken */
            foul_taken?: number | null;
            /** Fouls */
            fouls?: number | null;
            /** Games Played */
            games_played?: number | null;
            /** Goal Difference */
            goal_difference?: number | null;
            /** Goal Pass */
            goal_pass?: number | null;
            /** Goal To Shot Ratio */
            goal_to_shot_ratio?: number | null;
            /** Goals Conceded */
            goals_conceded?: number | null;
            /** Goals Scored */
            goals_scored?: number | null;
            /** Ground Duel Offence */
            ground_duel_offence?: number | null;
            /** Ground Duel Offence Ratio */
            ground_duel_offence_ratio?: number | null;
            /** Interception */
            interception?: number | null;
            /** Interception Per Match */
            interception_per_match?: number | null;
            /** Key Pass */
            key_pass?: number | null;
            /** Key Pass Per Match */
            key_pass_per_match?: number | null;
            /** Losses */
            losses?: number | null;
            /** Offsides */
            offsides?: number | null;
            /** Opponent Xg */
            opponent_xg?: number | null;
            /** Pass Accuracy Avg */
            pass_accuracy_avg?: number | null;
            /** Pass Cross */
            pass_cross?: number | null;
            /** Pass Cross Ratio */
            pass_cross_ratio?: number | null;
            /** Pass Forward */
            pass_forward?: number | null;
            /** Pass Long */
            pass_long?: number | null;
            /** Pass Long Ratio */
            pass_long_ratio?: number | null;
            /** Pass Per Match */
            pass_per_match?: number | null;
            /** Pass Progressive */
            pass_progressive?: number | null;
            /** Pass To 3Rd */
            pass_to_3rd?: number | null;
            /** Pass To Box */
            pass_to_box?: number | null;
            /** Passes */
            passes?: number | null;
            /** Penalty */
            penalty?: number | null;
            /** Penalty Ratio */
            penalty_ratio?: number | null;
            /** Points */
            points?: number | null;
            /** Possession Avg */
            possession_avg?: number | null;
            /** Recovery */
            recovery?: number | null;
            /** Recovery Per Match */
            recovery_per_match?: number | null;
            /** Red Cards */
            red_cards?: number | null;
            /** Season Id */
            season_id: number;
            /** Second Yellow Cards */
            second_yellow_cards?: number | null;
            /** Shot Per Match */
            shot_per_match?: number | null;
            /** Shots */
            shots?: number | null;
            /** Shots Off Goal */
            shots_off_goal?: number | null;
            /** Shots On Goal */
            shots_on_goal?: number | null;
            /** Tackle */
            tackle?: number | null;
            /** Tackle Per Match */
            tackle_per_match?: number | null;
            /** Team Id */
            team_id: number;
            /** Wins */
            wins?: number | null;
            /** Xg */
            xg?: number | null;
            /** Xg Per Match */
            xg_per_match?: number | null;
            /** Yellow Cards */
            yellow_cards?: number | null;
        };
        /**
         * TeamStatsTableEntry
         * @description Single team entry for the statistics table.
         */
        TeamStatsTableEntry: {
            /** Corners */
            corners?: number | null;
            /** Crosses */
            crosses?: number | null;
            /** Draws */
            draws?: number | null;
            /** Dribble Success */
            dribble_success?: number | null;
            /** Dribbles */
            dribbles?: number | null;
            /** Fouls */
            fouls?: number | null;
            /** Fouls Per Match */
            fouls_per_match?: number | null;
            /** Games Played */
            games_played?: number | null;
            /** Goal Difference */
            goal_difference?: number | null;
            /** Goals Conceded */
            goals_conceded?: number | null;
            /** Goals Conceded Per Match */
            goals_conceded_per_match?: number | null;
            /** Goals Per Match */
            goals_per_match?: number | null;
            /** Goals Scored */
            goals_scored?: number | null;
            /** Interceptions */
            interceptions?: number | null;
            /** Key Passes */
            key_passes?: number | null;
            /** Losses */
            losses?: number | null;
            /** Offsides */
            offsides?: number | null;
            /** Pass Accuracy */
            pass_accuracy?: number | null;
            /** Passes */
            passes?: number | null;
            /** Points */
            points?: number | null;
            /** Possession */
            possession?: number | null;
            /** Recoveries */
            recoveries?: number | null;
            /** Red Cards */
            red_cards?: number | null;
            /** Second Yellow Cards */
            second_yellow_cards?: number | null;
            /** Shot Accuracy */
            shot_accuracy?: number | null;
            /** Shots */
            shots?: number | null;
            /** Shots On Goal */
            shots_on_goal?: number | null;
            /** Shots Per Match */
            shots_per_match?: number | null;
            /** Tackles */
            tackles?: number | null;
            /** Team Id */
            team_id: number;
            /** Team Logo */
            team_logo?: string | null;
            /** Team Name */
            team_name: string;
            /** Wins */
            wins?: number | null;
            /** Xg */
            xg?: number | null;
            /** Xg Per Match */
            xg_per_match?: number | null;
            /** Yellow Cards */
            yellow_cards?: number | null;
        };
        /**
         * TeamStatsTableResponse
         * @description Response for team stats table endpoint.
         */
        TeamStatsTableResponse: {
            /** Items */
            items: components["schemas"]["TeamStatsTableEntry"][];
            /** Season Id */
            season_id: number;
            /** Sort By */
            sort_by: string;
            /** Total */
            total: number;
        };
        /** TeamTournamentListResponse */
        TeamTournamentListResponse: {
            /** Items */
            items: components["schemas"]["TeamTournamentResponse"][];
            /** Total */
            total: number;
        };
        /** TeamTournamentResponse */
        TeamTournamentResponse: {
            /**
             * Fine Points
             * @default 0
             */
            fine_points: number;
            /** Group Name */
            group_name?: string | null;
            /** Id */
            id: number;
            /**
             * Is Disqualified
             * @default false
             */
            is_disqualified: boolean;
            /** Season Id */
            season_id: number;
            /**
             * Sort Order
             * @default 0
             */
            sort_order: number;
            /** Team Id */
            team_id: number;
            /** Team Logo */
            team_logo?: string | null;
            /** Team Name */
            team_name?: string | null;
        };
        /** TournamentInChampionship */
        TournamentInChampionship: {
            /** Id */
            id: number;
            /** Name */
            name: string;
            /**
             * Seasons
             * @default []
             */
            seasons: components["schemas"]["SeasonBrief"][];
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
};
export type $defs = Record<string, never>;
export interface operations {
    login_api_v1_admin_auth_login_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    logout_api_v1_admin_auth_logout_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    me_api_v1_admin_auth_me_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MeResponse"];
                };
            };
        };
    };
    refresh_api_v1_admin_auth_refresh_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponse"];
                };
            };
        };
    };
    list_championships_api_v1_admin_championships_get: {
        parameters: {
            query?: {
                limit?: number;
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminChampionshipsListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_championship_api_v1_admin_championships_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminChampionshipCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminChampionshipResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_championship_api_v1_admin_championships__id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminChampionshipResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_championship_api_v1_admin_championships__id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_championship_api_v1_admin_championships__id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminChampionshipUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminChampionshipResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_cities_api_v1_admin_cities_get: {
        parameters: {
            query?: {
                limit?: number;
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminCitiesListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_city_api_v1_admin_cities_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminCityCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminCityResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_city_api_v1_admin_cities__id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_city_api_v1_admin_cities__id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminCityUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminCityResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_clubs_api_v1_admin_clubs_get: {
        parameters: {
            query?: {
                limit?: number;
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminClubsListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_club_api_v1_admin_clubs_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminClubCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminClubResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_club_api_v1_admin_clubs__id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminClubResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_club_api_v1_admin_clubs__id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_club_api_v1_admin_clubs__id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminClubUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminClubResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_file_api_v1_admin_files__category___file_path__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                category: string;
                file_path: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    upload_country_flag_api_v1_admin_files_countries__country_code__flag_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                country_code: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_country_flag_api_v1_admin_files_countries__country_code__flag_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_files_api_v1_admin_files_list_get: {
        parameters: {
            query?: {
                category?: string | null;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    upload_team_logo_api_v1_admin_files_teams__team_name__logo_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                team_name: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_team_logo_api_v1_admin_files_teams__team_name__logo_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    upload_file_api_v1_admin_files_upload_post: {
        parameters: {
            query?: {
                category?: string;
                language?: string | null;
                news_id?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_file_api_v1_admin_files_upload_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_materials_api_v1_admin_news_materials_get: {
        parameters: {
            query?: {
                page?: number;
                per_page?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminNewsMaterialListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_material_api_v1_admin_news_materials_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminNewsMaterialCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminNewsMaterialResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_material_api_v1_admin_news_materials__group_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                group_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminNewsMaterialResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_material_api_v1_admin_news_materials__group_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                group_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_material_api_v1_admin_news_materials__group_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                group_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminNewsMaterialUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminNewsMaterialResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_missing_translation_api_v1_admin_news_materials__group_id__translation__lang__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                group_id: string;
                lang: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminNewsTranslationCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminNewsMaterialResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    live_active_games_api_v1_admin_ops_live_active_games_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    live_events_api_v1_admin_ops_live_events__game_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GameEventsListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    live_start_api_v1_admin_ops_live_start__game_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LiveSyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    live_stop_api_v1_admin_ops_live_stop__game_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LiveSyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    live_sync_events_api_v1_admin_ops_live_sync_events__game_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    live_sync_lineup_api_v1_admin_ops_live_sync_lineup__game_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LineupSyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_all_game_events_api_v1_admin_ops_sync_all_game_events_post: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_finished_lineups_positions_api_v1_admin_ops_sync_finished_lineups_positions_post: {
        parameters: {
            query?: {
                batch_size?: number;
                limit?: number | null;
                season_id?: number | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["FinishedLineupsBackfillRequest"] | null;
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_full_api_v1_admin_ops_sync_full_post: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_game_events_api_v1_admin_ops_sync_game_events__game_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_game_lineup_api_v1_admin_ops_sync_game_lineup__game_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_game_stats_api_v1_admin_ops_sync_game_stats__game_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_games_api_v1_admin_ops_sync_games_post: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_player_season_stats_api_v1_admin_ops_sync_player_season_stats_post: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_players_api_v1_admin_ops_sync_players_post: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_score_table_api_v1_admin_ops_sync_score_table_post: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_team_logos_api_v1_admin_ops_sync_team_logos_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
        };
    };
    sync_team_season_stats_api_v1_admin_ops_sync_team_season_stats_post: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_teams_api_v1_admin_ops_sync_teams_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
        };
    };
    list_materials_api_v1_admin_pages_materials_get: {
        parameters: {
            query?: {
                page?: number;
                per_page?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPageMaterialListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_material_api_v1_admin_pages_materials_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPageMaterialUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPageMaterialResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_material_api_v1_admin_pages_materials__group_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                group_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPageMaterialResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_material_api_v1_admin_pages_materials__group_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                group_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPageMaterialUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPageMaterialResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_missing_translation_api_v1_admin_pages_materials__group_id__translation__lang__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                group_id: string;
                lang: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPageTranslationCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPageMaterialResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_partners_api_v1_admin_partners_get: {
        parameters: {
            query?: {
                championship_id?: number | null;
                limit?: number;
                offset?: number;
                season_id?: number | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPartnersListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_partner_api_v1_admin_partners_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPartnerCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPartnerResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_partner_api_v1_admin_partners__id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_partner_api_v1_admin_partners__id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPartnerUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPartnerResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_players_api_v1_admin_players_get: {
        parameters: {
            query?: {
                limit?: number;
                linked_to_sota?: boolean | null;
                offset?: number;
                search?: string | null;
                season_id?: number | null;
                team_id?: number | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPlayersListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_player_api_v1_admin_players_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPlayerCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPlayerResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_player_api_v1_admin_players__player_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                player_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPlayerResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_player_api_v1_admin_players__player_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                player_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_player_api_v1_admin_players__player_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                player_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPlayerUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPlayerResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_players_meta_api_v1_admin_players_meta_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPlayersMetaResponse"];
                };
            };
        };
    };
    list_playoff_brackets_api_v1_admin_playoff_brackets_get: {
        parameters: {
            query: {
                limit?: number;
                offset?: number;
                season_id: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPlayoffBracketsListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_playoff_bracket_api_v1_admin_playoff_brackets_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPlayoffBracketCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPlayoffBracketResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_playoff_bracket_api_v1_admin_playoff_brackets__id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_playoff_bracket_api_v1_admin_playoff_brackets__id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPlayoffBracketUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminPlayoffBracketResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_stages_api_v1_admin_stages_get: {
        parameters: {
            query: {
                limit?: number;
                offset?: number;
                season_id: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminStagesListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_stage_api_v1_admin_stages_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminStageCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminStageResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_stage_api_v1_admin_stages__id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_stage_api_v1_admin_stages__id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminStageUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminStageResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_team_tournaments_api_v1_admin_team_tournaments_get: {
        parameters: {
            query: {
                limit?: number;
                offset?: number;
                season_id: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminTeamTournamentsListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_team_tournament_api_v1_admin_team_tournaments_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminTeamTournamentCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminTeamTournamentResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_team_tournament_api_v1_admin_team_tournaments__id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_team_tournament_api_v1_admin_team_tournaments__id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminTeamTournamentUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminTeamTournamentResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_users_api_v1_admin_users_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminUserResponse"][];
                };
            };
        };
    };
    create_user_api_v1_admin_users_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminUserCreateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminUserResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_user_api_v1_admin_users__user_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                user_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminUserUpdateRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminUserResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reset_password_api_v1_admin_users__user_id__reset_password_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                user_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminPasswordResetRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_championships_api_v1_championships_get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChampionshipListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_championship_api_v1_championships__championship_id__get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path: {
                championship_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChampionshipResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_championships_tree_api_v1_championships_tree_get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChampionshipTreeListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_cities_api_v1_cities_get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CityListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_clubs_api_v1_clubs_get: {
        parameters: {
            query?: {
                city_id?: number | null;
                lang?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClubListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_club_api_v1_clubs__club_id__get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path: {
                club_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClubWithTeamsResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_countries_api_v1_countries_get: {
        parameters: {
            query?: {
                include_inactive?: boolean;
                /** @description Language: kz, ru, or en */
                lang?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CountryListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_country_api_v1_countries_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CountryCreate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CountryResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_country_api_v1_countries__country_id__get: {
        parameters: {
            query?: {
                /** @description Language: kz, ru, or en */
                lang?: string;
            };
            header?: never;
            path: {
                country_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CountryResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_country_api_v1_countries__country_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                country_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CountryUpdate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CountryResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_country_api_v1_countries__country_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                country_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_country_flag_api_v1_countries__country_id__flag_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                country_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    upload_country_flag_api_v1_countries__country_id__flag_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                country_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_country_flag_api_v1_countries__country_id__flag_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CountryResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_cup_overview_api_v1_cup__season_id__overview_get: {
        parameters: {
            query?: {
                lang?: string;
                recent_limit?: number;
                upcoming_limit?: number;
            };
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CupOverviewResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_cup_schedule_api_v1_cup__season_id__schedule_get: {
        parameters: {
            query?: {
                lang?: string;
                /** @description Filter by round key (e.g. '1_4', 'group_1') */
                round_key?: string | null;
            };
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CupScheduleResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    delete_file_api_v1_files__category___file_path__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                category: string;
                file_path: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    download_file_api_v1_files_download__category___file_path__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                category: string;
                file_path: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_files_api_v1_files_list_get: {
        parameters: {
            query?: {
                category?: string | null;
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_team_logo_api_v1_files_teams__team_name__logo_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                team_name: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    upload_team_logo_api_v1_files_teams__team_name__logo_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                team_name: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_team_logo_api_v1_files_teams__team_name__logo_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeamLogoResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    list_team_logos_api_v1_files_teams_logos_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    upload_file_api_v1_files_upload_post: {
        parameters: {
            query?: {
                category?: string;
                /** @description Language (RU, KZ) for documents */
                language?: string | null;
                /** @description News article ID for news images */
                news_id?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_file_api_v1_files_upload_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FileUploadResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    view_file_api_v1_files_view__category___file_path__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                category: string;
                file_path: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_games_api_v1_games_get: {
        parameters: {
            query?: {
                date_from?: string | null;
                date_to?: string | null;
                group_by_date?: boolean;
                hide_past?: boolean;
                lang?: string;
                limit?: number;
                month?: number | null;
                offset?: number;
                season_id?: number | null;
                status?: string | null;
                team_id?: number | null;
                team_ids?: number[] | null;
                tour?: number | null;
                tours?: number[] | null;
                year?: number | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_game_api_v1_games__game_id__get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_game_lineup_api_v1_games__game_id__lineup_get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_game_stats_api_v1_games__game_id__stats_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_active_games_api_v1_live_active_games_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    get_websocket_connections_api_v1_live_connections__game_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_game_events_api_v1_live_events__game_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GameEventsListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    start_live_sync_api_v1_live_start__game_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LiveSyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    stop_live_sync_api_v1_live_stop__game_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LiveSyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_events_api_v1_live_sync_events__game_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_lineup_api_v1_live_sync_lineup__game_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LineupSyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_news_list_api_v1_news_get: {
        parameters: {
            query?: {
                /** @description Filter by type: news or analytics */
                article_type?: string | null;
                lang?: string;
                /** @description Page number */
                page?: number;
                /** @description Items per page */
                per_page?: number;
                /** @description Filter by tournament ID (pl, 1l, cup, 2l, el) */
                tournament_id?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NewsListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_news_item_api_v1_news__news_id__get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path: {
                news_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_news_navigation_api_v1_news__news_id__navigation_get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path: {
                news_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_article_types_api_v1_news_article_types_get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: number;
                    };
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_latest_news_api_v1_news_latest_get: {
        parameters: {
            query?: {
                lang?: string;
                /** @description Number of news items */
                limit?: number;
                /** @description Filter by tournament ID (pl, 1l, cup, 2l, el) */
                tournament_id?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NewsListItem"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_slider_news_api_v1_news_slider_get: {
        parameters: {
            query?: {
                lang?: string;
                /** @description Filter by tournament ID (pl, 1l, cup, 2l, el) */
                tournament_id?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NewsListItem"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_pages_api_v1_pages_get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageListResponse"][];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_page_api_v1_pages__slug__get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path: {
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_contacts_api_v1_pages_contacts__language__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                language: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PageResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_documents_api_v1_pages_documents__language__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                language: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_leadership_api_v1_pages_leadership__language__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                language: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_partners_api_v1_partners_get: {
        parameters: {
            query?: {
                championship_id?: number | null;
                season_id?: number | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PartnerListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_players_api_v1_players_get: {
        parameters: {
            query?: {
                /** @description Language: kz, ru, or en */
                lang?: string;
                limit?: number;
                offset?: number;
                season_id?: number | null;
                team_id?: number | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_player_api_v1_players__player_id__get: {
        parameters: {
            query?: {
                /** @description Language: kz, ru, or en */
                lang?: string;
                season_id?: number | null;
            };
            header?: never;
            path: {
                player_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_player_games_api_v1_players__player_id__games_get: {
        parameters: {
            query?: {
                limit?: number;
                season_id?: number;
            };
            header?: never;
            path: {
                player_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GameListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_player_stats_api_v1_players__player_id__stats_get: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path: {
                player_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerSeasonStatsResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_player_teammates_api_v1_players__player_id__teammates_get: {
        parameters: {
            query?: {
                /** @description Language: kz, ru, or en */
                lang?: string;
                limit?: number;
                season_id?: number;
            };
            header?: never;
            path: {
                player_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerTeammatesListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_player_tournament_history_api_v1_players__player_id__tournaments_get: {
        parameters: {
            query?: {
                /** @description Language: kz, ru, or en */
                lang?: string;
            };
            header?: never;
            path: {
                player_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerTournamentHistoryResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_seasons_api_v1_seasons_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SeasonListResponse"];
                };
            };
        };
    };
    get_season_api_v1_seasons__season_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SeasonResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_season_bracket_api_v1_seasons__season_id__bracket_get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayoffBracketResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_season_games_api_v1_seasons__season_id__games_get: {
        parameters: {
            query?: {
                lang?: string;
                tour?: number | null;
            };
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_goals_by_period_api_v1_seasons__season_id__goals_by_period_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SeasonGoalsByPeriodResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_season_groups_api_v1_seasons__season_id__groups_get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SeasonGroupsResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_player_stats_table_api_v1_seasons__season_id__player_stats_get: {
        parameters: {
            query?: {
                /** @description Filter by group name (e.g. 'A', 'B') */
                group?: string | null;
                lang?: string;
                limit?: number;
                nationality?: string | null;
                offset?: number;
                position_code?: string | null;
                sort_by?: string;
                team_id?: number | null;
            };
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerStatsTableResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_results_grid_api_v1_seasons__season_id__results_grid_get: {
        parameters: {
            query?: {
                /** @description Filter by group name (e.g. 'A', 'B') */
                group?: string | null;
                lang?: string;
            };
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResultsGridResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_season_stages_api_v1_seasons__season_id__stages_get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StageListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_stage_games_api_v1_seasons__season_id__stages__stage_id__games_get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path: {
                season_id: number;
                stage_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_season_statistics_api_v1_seasons__season_id__statistics_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SeasonStatisticsResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    update_season_sync_api_v1_seasons__season_id__sync_patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SeasonSyncUpdate"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SeasonResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_season_table_api_v1_seasons__season_id__table_get: {
        parameters: {
            query?: {
                /** @description Filter by group name (e.g. 'A', 'B') */
                group?: string | null;
                /** @description Filter home/away games */
                home_away?: string | null;
                lang?: string;
                /** @description From matchweek (inclusive) */
                tour_from?: number | null;
                /** @description To matchweek (inclusive) */
                tour_to?: number | null;
            };
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_team_stats_table_api_v1_seasons__season_id__team_stats_get: {
        parameters: {
            query?: {
                /** @description Filter by group name (e.g. 'A', 'B') */
                group?: string | null;
                lang?: string;
                limit?: number;
                offset?: number;
                sort_by?: string;
            };
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeamStatsTableResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_season_teams_api_v1_seasons__season_id__teams_get: {
        parameters: {
            query?: {
                lang?: string;
            };
            header?: never;
            path: {
                season_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeamTournamentListResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_all_game_events_api_v1_sync_all_game_events_post: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_full_api_v1_sync_full_post: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_game_events_api_v1_sync_game_events__game_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_game_lineup_api_v1_sync_game_lineup__game_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_game_stats_api_v1_sync_game_stats__game_id__post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                game_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_games_api_v1_sync_games_post: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_player_season_stats_api_v1_sync_player_season_stats_post: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_players_api_v1_sync_players_post: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_score_table_api_v1_sync_score_table_post: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_team_logos_api_v1_sync_team_logos_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
        };
    };
    sync_team_season_stats_api_v1_sync_team_season_stats_post: {
        parameters: {
            query?: {
                season_id?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    sync_teams_api_v1_sync_teams_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SyncResponse"];
                };
            };
        };
    };
    get_teams_api_v1_teams_get: {
        parameters: {
            query?: {
                /** @description Language: kz, ru, or en */
                lang?: string;
                season_id?: number | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_team_api_v1_teams__team_id__get: {
        parameters: {
            query?: {
                /** @description Language: kz, ru, or en */
                lang?: string;
            };
            header?: never;
            path: {
                team_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_team_coaches_api_v1_teams__team_id__coaches_get: {
        parameters: {
            query?: {
                /** @description Language: kz, ru, or en */
                lang?: string;
                season_id?: number;
            };
            header?: never;
            path: {
                team_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_team_games_api_v1_teams__team_id__games_get: {
        parameters: {
            query?: {
                /** @description Language: kz, ru, or en */
                lang?: string;
                season_id?: number;
            };
            header?: never;
            path: {
                team_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_team_overview_api_v1_teams__team_id__overview_get: {
        parameters: {
            query?: {
                fixtures_limit?: number;
                lang?: string;
                leaders_limit?: number;
                season_id?: number | null;
            };
            header?: never;
            path: {
                team_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeamOverviewResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_team_players_api_v1_teams__team_id__players_get: {
        parameters: {
            query?: {
                /** @description Language: kz, ru, or en */
                lang?: string;
                season_id?: number;
            };
            header?: never;
            path: {
                team_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_team_stats_api_v1_teams__team_id__stats_get: {
        parameters: {
            query?: {
                lang?: string;
                season_id?: number;
            };
            header?: never;
            path: {
                team_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TeamSeasonStatsResponse"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    get_head_to_head_api_v1_teams__team1_id__vs__team2_id__head_to_head_get: {
        parameters: {
            query?: {
                /** @description Language: kz, ru, or en */
                lang?: string;
                season_id?: number;
            };
            header?: never;
            path: {
                team1_id: number;
                team2_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    health_check_health_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
}
